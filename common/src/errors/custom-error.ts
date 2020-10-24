/**
 * Implement this if you want to make your own error returned from any service
 * to the frontend.
 */
export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract serializeErrors(): { message: string; field?: string }[];

  constructor(message: string) {
    super(message);
    // Only because we are extending a build in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
