import { ObjectId } from 'mongodb';

export interface Post {
    _id?: ObjectId;
    userId?: string;
    postId: string;
    fromGuest: boolean;
    post: string;
    status: string;
    createdOn: string;
    lastModifiedOn: string;
    createdBy: string;
    modifiedBy: string;
}

export enum PostStatus {
    ACTIVE = 'ACTIVE',
    DELETED = 'DELETED',
}
