import { IBaseRequest } from '@application/Request/Request';
import { successResponse } from '@application/Utils';
import { SavePostDTO } from '@module/Domain/DTO';
import { PostService } from '@module/Service';
import { NextFunction, RequestHandler, Response } from 'express';

export class PostController {
    constructor(private service: PostService) {
        this.service = service;
    }

    savePost: RequestHandler = async (
        req: IBaseRequest<SavePostDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const postInfo = await this.service.SavePost(
                req.body.data,
                res.locals.authData,
            );

            return successResponse(res, 'post saved Successfully', {
                postInfo,
            });
        } catch (err) {
            next(err);
        }
    };
}
