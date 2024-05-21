import { IDatabase } from '@infrastructure/Database';
import { Post, PostStatus } from '../Model';

export interface IPostRepository {
    readonly db: IDatabase;
    savePost(post: Post): Promise<void>;
    deletePost(postId: string, date: string, modifier: string): Promise<void>;
    getPost(postId: string): Promise<Post>;
    getPosts(postId: string): Promise<Post[]>;
}

export class PostRepository implements IPostRepository {
    private database;

    constructor(readonly db: IDatabase) {
        this.database = db.getDb();
    }

    async savePost(post: Post): Promise<void> {
        await this.database.collection<Post>('posts').insertOne(post);
    }

    async getPost(postId: string): Promise<Post> {
        const post = await this.database
            .collection<Post>('posts')
            .findOne({ postId });
        return post as Post;
    }

    async getPosts(userId?: string): Promise<Post[]> {
        const query: any = {};
        if (userId) {
            query[userId] = userId;
        }
        const posts = await this.database
            .collection<Post>('posts')
            .find(query)
            .toArray();
        return posts as Post[];
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
