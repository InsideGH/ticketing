import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    /**
     * Inputs are good.
     */
    const { email, password } = req.body;

    /**
     * Handle 'email in use' error.
     */
    const existingUser = await User.findOne({
      email,
    });
    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    /**
     * Create user in db.
     */
    const user = User.build({ email, password });
    await user.save();

    /**
     * Create user jwt.
     */
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!,
    );

    /**
     * We don't assume that there is a session object on req.
     * The payload will be base64 encoded.
     */
    req.session = { jwt: userJwt };

    res.status(201).send(user);
  },
);

export { router as signupRouter };
