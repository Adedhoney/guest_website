import { IBaseRequest } from '@application/Request/Request';
import { successResponse } from '@application/Utils';
import { SavePostDTO } from '@module/Domain/DTO';
import { IPostService } from '@module/Service';
import { NextFunction, Request, RequestHandler, Response } from 'express';

export class PostController {
    constructor(private service: IPostService) {
        this.service = service;
    }

    savePost: RequestHandler = async (
        req: IBaseRequest<SavePostDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const post = await this.service.SavePost(
                req.body.data,
                res.locals.authData,
            );

            return successResponse(res, 'Post saved Successfully', {
                post,
            });
        } catch (err) {
            next(err);
        }
    };
    getPost: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const post = await this.service.GetPost(req.params.postId);

            return successResponse(res, 'Post', {
                post,
            });
        } catch (err) {
            next(err);
        }
    };
    getPosts: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const posts = await this.service.GetPosts(
                req.query.userName as string,
            );

            return successResponse(res, 'Posts', {
                posts,
            });
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
            await this.service.DeletePost(
                req.params.postId,
                res.locals.authData,
            );

            return successResponse(res, 'Post deleted successfully');
        } catch (err) {
            next(err);
        }
    };
}
