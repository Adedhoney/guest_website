import { generateRandomId, getCurrentTimeStamp } from '@application/Utils';
import { SavePostDTO } from '@module/Domain/DTO';
import { Post, PostStatus, User } from '@module/Domain/Model';
import { IAccountRepository, IPostRepository } from '@module/Domain/Repository';

export interface IPostService {
    SavePost(data: SavePostDTO, user: User): Promise<Post>;
    DeletePost(postId: string, authUser: User): Promise<void>;
    GetPost(postId: string): Promise<Post>;
    GetPosts(userName: string): Promise<Post>;
}

export class PostService implements IPostService {
    constructor(
        private postrepo: IPostRepository,
        private acctrepo: IAccountRepository,
    ) {
        this.postrepo = postrepo;
        this.acctrepo = acctrepo;
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

    async GetPost(postId: string): Promise<Post> {
        const post = await this.postrepo.getPost(postId);
        return post;
    }
    async GetPosts(userName: string): Promise<Post> {
        const { userId } = await this.acctrepo.getUserByUserName(userName);
        const post = await this.postrepo.getPost(userId);
        return post;
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
