import { IDatabase } from '@infrastructure/Database';
import { Post, PostStatus } from '../Model';

export interface IPostRepository {
    readonly db: IDatabase;
    savePost(post: Post): Promise<void>;
    deletePost(postId: string, date: string, modifier: string): Promise<void>;
    getPost(postId: string): Promise<Post>;
    getPosts(userId?: string): Promise<Post[]>;
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
            .aggregate([
                { $match: { postId, status: PostStatus.ACTIVE } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: 'userId',
                        as: 'userDetails',
                    },
                },
                {
                    $project: {
                        userId: 1,
                        postId: 1,
                        fromGuest: 1,
                        post: 1,
                        status: 1,
                        createdOn: 1,
                        lastModifiedOn: 1,
                        createdBy: 1,
                        modifiedBy: 1,
                        'userDetails.userName': 1,
                    },
                },
            ])
            .toArray();

        return post[0] as Post;
    }

    async getPosts(userId?: string): Promise<Post[]> {
        const query: any = { status: PostStatus.ACTIVE };
        if (userId) {
            query.userId = userId;
        }

        const posts = await this.database
            .collection<Post>('posts')
            .aggregate([
                { $match: { ...query } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: 'userId',
                        as: 'userDetails',
                    },
                },
                {
                    $project: {
                        userId: 1,
                        postId: 1,
                        fromGuest: 1,
                        post: 1,
                        status: 1,
                        createdOn: 1,
                        lastModifiedOn: 1,
                        createdBy: 1,
                        modifiedBy: 1,
                        'userDetails.userName': 1,
                    },
                },
            ])
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
                $set: {
                    post: '',
                    status: PostStatus.DELETED,
                    lastModifiedOn: date,
                    modifiedBy: modifier,
                },
            },
        );
    }
}
