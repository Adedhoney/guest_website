import { IDatabase } from '@infrastructure/Database';
import { OTP, Post, User, UserStatus } from '../Model';

export interface IAccountRepository {
    readonly db: IDatabase;
    saveUser(user: User): Promise<void>;
    getUserById(userId: string): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    getUserByUserName(email: string): Promise<User>;
    userNameAvalable(userName: string): Promise<boolean>;
    BanUser(userId: string): Promise<void>;

    getUsers(): Promise<User[]>;
    deleteUser(userId: string): Promise<void>;
    updateUser(user: User): Promise<void>;
    updatePassword(
        userId: string,
        password: string,
        date: string,
    ): Promise<void>;

    saveOTP(email: string, otp: string, expiry: string): Promise<void>;
    getOTP(email: string, otp: string): Promise<OTP>;
    deleteOTP(email: string): Promise<void>;
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

    async getUserById(userId: string): Promise<User> {
        const user = await this.database
            .collection<User>('users')
            .findOne({ userId });
        return user as User;
    }
    async getUserByEmail(email: string): Promise<User> {
        const user = await this.database
            .collection<User>('users')
            .findOne({ email });
        return user as User;
    }
    async getUserByUserName(userName: string): Promise<User> {
        const user = await this.database
            .collection<User>('users')
            .findOne({ userName });
        return user as User;
    }
    async userNameAvalable(userName: string): Promise<boolean> {
        const user = await this.database
            .collection<User>('users')
            .findOne({ userName });
        if (user) {
            return false;
        }
        return true;
    }

    async getUsers(): Promise<User[]> {
        const users = await this.database
            .collection<User>('users')
            .find({})
            .toArray();
        return users as User[];
    }

    async BanUser(userId: string): Promise<void> {
        await this.database
            .collection<User>('users')
            .updateOne({ userId }, { $set: { status: UserStatus.BANNED } });
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
            .updateOne({ userId: user.userId }, { $set: { ...user } });
    }

    async updatePassword(
        userId: string,
        password: string,
        date: string,
    ): Promise<void> {
        await this.database
            .collection<User>('users')
            .updateOne(
                { userId },
                { $set: { password, lastModifiedOn: date } },
            );
    }

    async saveOTP(email: string, otp: string, expiry: string): Promise<void> {
        await this.database
            .collection<OTP>('otps')
            .insertOne({ email, otp, expiry });
    }

    async getOTP(email: string, otp: string): Promise<OTP> {
        const otpInfo = await this.database
            .collection<OTP>('otps')
            .findOne({ email, otp });
        return otpInfo as OTP;
    }

    async deleteOTP(email: string): Promise<void> {
        await this.database.collection<OTP>('otps').deleteMany({ email });
    }
}
