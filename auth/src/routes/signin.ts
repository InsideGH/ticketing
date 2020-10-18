import express from 'express';

const router = express.Router();

router.post('/api/users/signin', (req, res) => {
  console.log('signin');
  res.send('ok!');
});

export { router as signinRouter };
