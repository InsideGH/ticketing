import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';

import { User } from '../models/user';
import { Password } from '../services/password';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must supply password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    /**
     * Inputs are good.
     */
    const { email, password } = req.body;

    /**
     * Get user from database.
     */
    const existingUser = await User.findOne({
      email,
    });

    /**
     * Non existing user.
     */
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    /**
     * Check password.
     */
    const passwordsMatch = await Password.compare(existingUser.password, password);
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    /**
     * Create user jwt.
     */
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!,
    );

    /**
     * We don't assume that there is a session object on req.
     * The payload will be base64 encoded.
     */
    req.session = { jwt: userJwt };

    console.log('signin');
    res.status(200).send(existingUser);
  },
);

export { router as signinRouter };
