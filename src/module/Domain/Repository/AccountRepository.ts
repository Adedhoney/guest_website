import { IDatabase } from '@infrastructure/Database';
import { Post, User } from '../Model';

export interface IAccountRepository {
    readonly db: IDatabase;
    saveUser(user: User): Promise<void>;
    getUser(userId: string): Promise<User>;
    getUsers(): Promise<User[]>;
    deleteUser(userId: string): Promise<void>;
    updateUser(user: User): Promise<void>;
    updatePassword(userId: string, password: string): Promise<void>;
}

export class AccountRepository implements IAccountRepository {
    private database;
    constructor(readonly db: IDatabase) {
        this.db = db;
        this.database = db.getDb();
    }

    async saveUser(user: User): Promise<void> {
        await this.database.collection<User>('users').insertOne(user);
    }

    async getUser(userId: string): Promise<User> {
        const user = await this.database
            .collection<User>('users')
            .findOne({ userId });
        return user as User;
    }

    async getUsers(): Promise<User[]> {
        const users = await this.database
            .collection<User>('users')
            .find({})
            .toArray();
        return users as User[];
    }

    async deleteUser(userId: string): Promise<void> {
        const session = this.db.startSession();
        session.startTransaction();
        try {
            await this.database.collection<User>('users').deleteOne({ userId });
            await this.database
                .collection<Post>('posts')
                .deleteMany({ userId });
            session.commitTransaction();
        } catch (error) {
            console.log(error);
            await session.abortTransaction();
            throw new Error((error as Error).message);
        } finally {
            session.endSession;
        }
    }

    async updateUser(user: User): Promise<void> {
        await this.database
            .collection<User>('users')
            .updateOne({ userId: user.userId }, user);
    }

    async updatePassword(userId: string, password: string): Promise<void> {
        await this.database
            .collection<User>('users')
            .updateOne({ userId }, { password });
    }
}
