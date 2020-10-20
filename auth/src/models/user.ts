import mongoose from 'mongoose';
import { Password } from '../services/password';
/**
 * An interface that describes the properties to create a new user.
 */
interface UserAttrs {
  email: string;
  password: string;
}

/**
 * An interface that describes the properties that a User model has
 */
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

/**
 * An interface that describes what a User document is.
 *
 */
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String, // JS String (constructor) vs TS string
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  },
);

/**
 * Mongoose requires us to call done when we are done.
 * NOT using arrow function, since mongoose gives us this and
 * we need it.
 */
userSchema.pre('save', async function (done) {
  // isModified will bu true first time as well.
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});
/**
 * Tell mongoose that we want a static build method on the User model.
 */
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

/**
 * This is of type UserModel (2nd generic) which has a static build method.
 * The returned UserModel will model a UserDoc of type Document (1st generic).
 */
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
