import { CustomError } from '@application/Error/Error';
import { StatusCode } from '@application/Utils';
import { NextFunction, Request, Response } from 'express';

export const Authorization = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const isAdmin = res.locals.isAdmin as boolean;

    if (!isAdmin) {
        return next(
            new CustomError('Unauthorized access', StatusCode.UNAUTHORIZED),
        );
    }

    next();
};
