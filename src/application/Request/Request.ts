import { Request } from 'express';

export interface IBaseRequest<T> extends Request {
    body: {
        data: T;
    };
}

export interface IBaseQueryRequest<T> extends Request<any, any, any, T> {}
