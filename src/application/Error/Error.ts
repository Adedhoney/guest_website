export abstract class BaseError extends Error {
  abstract status: number;

  constructor(public message: string = 'Something went wrong') {
    super(message);
  }
}

export class NotFoundError extends BaseError {
  status = 404;
  message: string;

  constructor(message: string = 'Not Found') {
    super(message);
    this.message = message;
    this.status = 404;
  }
}

export class CustomError extends BaseError {
  status: number;
  message: string;

  constructor(message: string, status: number = 200) {
    super(message);
    this.message = message;
    this.status = status;
  }
}

export class TokenExpiredError extends BaseError {
  status: number;
  constructor(message: string = 'Token Expire') {
    super(message);
    this.message = message;
    this.status = 401;
  }
}

export class InvalidTokenError extends BaseError {
  status: number;
  constructor(message: string = 'Invalid Token') {
    super(message);
    this.message = message;
    this.status = 401;
  }
}
