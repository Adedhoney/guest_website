import { IBaseRequest } from '@application/Request/Request';
import { successResponse, verifyAuthToken } from '@application/Utils';
import { SavePostDTO } from '@module/Domain/DTO';
import { IAccountRepository } from '@module/Domain/Repository';
import { IPostService } from '@module/Service';
import { NextFunction, Request, RequestHandler, Response } from 'express';

export class PostController {
    constructor(
        private service: IPostService,
        private acctrepo: IAccountRepository,
    ) {
        this.service = service;
        this.acctrepo = acctrepo;
    }

    savePost: RequestHandler = async (
        req: IBaseRequest<SavePostDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const token = req.headers['authorization']?.split(' ')[1] as string;
            if (!token) {
                const post = await this.service.SavePost(req.body.data);

                return successResponse(res, 'Post saved Successfully', {
                    post,
                });
            }
            const validate = verifyAuthToken(token);
            if (!validate.userId) {
                const post = await this.service.SavePost(req.body.data);

                return successResponse(res, 'Post saved Successfully', {
                    post,
                });
            }
            const authData = await this.acctrepo.getUserById(validate.userId);
            if (!authData) {
                const post = await this.service.SavePost(req.body.data);

                return successResponse(res, 'Post saved Successfully', {
                    post,
                });
            }
            const post = await this.service.SavePost(req.body.data, authData);

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
