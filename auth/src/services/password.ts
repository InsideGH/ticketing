import bcrypt from 'bcrypt';

const saltRounds = 10;

export class Password {
  static async toHash(password: string) {
    return await bcrypt.hash(password, saltRounds);
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    return await bcrypt.compare(suppliedPassword, storedPassword);
  }
}
