import { IDatabase } from '@infrastructure/Database';
import { Post, PostStatus } from '../Model';

export interface IPostRepository {
    readonly db: IDatabase;
    savePost(post: Post): Promise<void>;
    deletePost(postId: string, date: string, modifier: string): Promise<void>;
}

export class PostRepository implements IPostRepository {
    private database;

    constructor(readonly db: IDatabase) {
        this.database = db.getDb();
    }

    async savePost(post: Post): Promise<void> {
        await this.database.collection<Post>('posts').insertOne(post);
    }

    async deletePost(
        postId: string,
        date: string,
        modifier: string,
    ): Promise<void> {
        await this.database.collection<Post>('posts').updateOne(
            { postId },
            {
                post: '',
                status: PostStatus.DELETED,
                lastModifiedOn: date,
                modifiedBy: modifier,
            },
        );
    }
}
