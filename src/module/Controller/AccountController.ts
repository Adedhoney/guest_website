import { IBaseRequest } from '@application/Request/Request';
import { successResponse } from '@application/Utils';
import {
    LogInDTO,
    ResetPasswordDTO,
    SignUpDTO,
    UpdateInfoDTO,
    UpdatePassWordDTO,
    VerifyOtpDTO,
} from '@module/Domain/DTO';
import { IAccountService } from '@module/Service';
import { NextFunction, Request, RequestHandler, Response } from 'express';

export class AccountController {
    constructor(private service: IAccountService) {
        this.service = service;
    }

    signUp: RequestHandler = async (
        req: IBaseRequest<SignUpDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.SignUp(req.body.data);

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };

    logIn: RequestHandler = async (
        req: IBaseRequest<LogInDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const user = await this.service.LogIn(req.body.data);

            return successResponse(res, 'Successful', user);
        } catch (err) {
            next(err);
        }
    };

    getUser: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const user = await this.service.GetUser(req.body.data);

            return successResponse(res, 'Successful', user);
        } catch (err) {
            next(err);
        }
    };

    updateInfo: RequestHandler = async (
        req: IBaseRequest<UpdateInfoDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const user = await this.service.UpdateInfo(
                req.body.data,
                res.locals.authData.userId,
            );

            return successResponse(res, 'Successful', user);
        } catch (err) {
            next(err);
        }
    };

    updatePassword: RequestHandler = async (
        req: IBaseRequest<UpdatePassWordDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.UpdatePassword(
                req.body.data,
                res.locals.authData.userId,
            );

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };

    deleteUser: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.DeleteUser(req.params.userId);

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };

    forgotPassword: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.ForgotPassword(req.params.email);

            return successResponse(
                res,
                `OTP email sent to ${req.params.email}`,
            );
        } catch (err) {
            next(err);
        }
    };
    verifyOTP: RequestHandler = async (
        req: IBaseRequest<VerifyOtpDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const token = await this.service.VerifyOTP(req.body.data);

            return successResponse(res, `OTP verified successfully`, {
                otpToken: token,
            });
        } catch (err) {
            next(err);
        }
    };

    resetPassword: RequestHandler = async (
        req: IBaseRequest<ResetPasswordDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.ResetPassword(req.body.data);
            return successResponse(res, `Password reset successful`);
        } catch (err) {
            next(err);
        }
    };
}
