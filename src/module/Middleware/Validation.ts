import { NextFunction, Request, Response } from 'express';
import { CustomError } from '@application/Error/Error';
import { StatusCode } from '@application/Utils';
import { ObjectSchema } from 'joi';

export const Validation =
  (schema: ObjectSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body.data;
    if (!data) {
      return next(
        new CustomError('Invalid request data', StatusCode.BAD_REQUEST),
      );
    }

    const { error } = schema.validate(data);
    if (error) {
      return next(new CustomError(error.message, StatusCode.BAD_REQUEST));
    }

    next();
  };
