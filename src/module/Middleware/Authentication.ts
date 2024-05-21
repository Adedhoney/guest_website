import {
    CustomError,
    InvalidTokenError,
    TokenExpiredError,
} from '@application/Error/Error';
import { StatusCode, verifyAuthToken } from '@application/Utils';
import { IAccountRepository } from '@module/Domain/Repository';

import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';

export const Authentication =
    (acctrepo: IAccountRepository) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers['authorization']?.split(' ')[1];
            if (!token) {
                return next(
                    new CustomError('Unauthorized', StatusCode.UNAUTHORIZED),
                );
            }
            const validate = verifyAuthToken(token);
            const authData = await acctrepo.getUserById(validate.userId);
            if (!authData)
                return next(
                    new CustomError('Unauthorized', StatusCode.UNAUTHORIZED),
                );

            res.locals.authData = authData;
            res.locals.isAdmin = authData.isAdmin;
            next();
        } catch (err: JsonWebTokenError | any) {
            if (
                err instanceof JsonWebTokenError &&
                err.message == 'invalid signature'
            ) {
                return next(new InvalidTokenError());
            }

            return next(new TokenExpiredError());
        }
    };
