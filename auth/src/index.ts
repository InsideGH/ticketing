import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  console.log('starting......');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY env variable must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI env variable must be defined');
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // Object that suppresses mongoose deprecation warnings
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to mongoDb');
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();
