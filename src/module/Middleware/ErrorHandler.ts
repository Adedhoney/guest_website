import { BaseError } from '@application/Error/Error';
import { ResponseDTO, ResponseStatus } from '@application/Response/Response';
import { NextFunction, Request, Response } from 'express';

export const ErrorHandler = (
  error: Error | BaseError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('[ERROR]', { error });

  let status = 500,
    message = 'Something went wrong';

  if (error instanceof BaseError) {
    status = error.status;
    message = error.message;

    res.status(status).send(new ResponseDTO(ResponseStatus.ERROR, message));
    return next();
  }

  res.status(status).send(new ResponseDTO(ResponseStatus.ERROR, message));
  return next();
};
