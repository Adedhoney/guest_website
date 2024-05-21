import { successResponse } from '@application/Utils';
import { IAdminService } from '@module/Service';
import { NextFunction, Request, RequestHandler, Response } from 'express';

export class AdminController {
    constructor(private service: IAdminService) {
        this.service = service;
    }

    deleteUser: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.DeleteUser(req.params.userId);

            return successResponse(res, 'User deleted successfully');
        } catch (err) {
            next(err);
        }
    };

    banUser: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.BanUser(req.params.userId);

            return successResponse(res, 'User banned successfully');
        } catch (err) {
            next(err);
        }
    };

    deletePost: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.BanUser(req.params.postId);

            return successResponse(res, 'Post deleted successfully');
        } catch (err) {
            next(err);
        }
    };
}
