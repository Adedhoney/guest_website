import { generateRandomId, getCurrentTimeStamp } from '@application/Utils';
import { SavePostDTO } from '@module/Domain/DTO';
import { Post, PostStatus, User } from '@module/Domain/Model';
import { IPostRepository } from '@module/Domain/Repository';

export interface IPostService {
    SavePost(data: SavePostDTO, user: User): Promise<Post>;
    DeletePost(postId: string, authUser: User): Promise<void>;
}

export class PostService implements IPostService {
    constructor(private postrepo: IPostRepository) {
        this.postrepo = postrepo;
    }

    async SavePost(data: SavePostDTO, authUser?: User): Promise<Post> {
        const postId = generateRandomId();
        const date = getCurrentTimeStamp();

        const postInfo = {
            userId: authUser ? authUser.userId : undefined,
            postId,
            fromGuest: authUser ? true : false,
            post: data.post,
            status: PostStatus.ACTIVE,
            createdOn: date,
            lastModifiedOn: date,
            createdBy: authUser
                ? `${authUser.userName} ${authUser.userId}`
                : 'Guest',
            modifiedBy: authUser
                ? `${authUser.userName} ${authUser.userId}`
                : 'Guest',
        };
        await this.postrepo.savePost(postInfo);
        return postInfo;
    }

    async DeletePost(postId: string, authUser: User): Promise<void> {
        const date = getCurrentTimeStamp();

        await this.postrepo.deletePost(
            postId,
            date,
            `${authUser.userName} ${authUser.userId}`,
        );
    }
}
