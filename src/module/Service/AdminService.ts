import { getCurrentTimeStamp } from '@application/Utils';
import { User } from '@module/Domain/Model';
import { IAccountRepository, IPostRepository } from '@module/Domain/Repository';

export interface IAdminService {
    BanUser(userId: string): Promise<void>;
    DeleteUser(userId: string): Promise<void>;
    DeletePost(post: string, authUser: User): Promise<void>;
}

export class AdminService implements IAdminService {
    constructor(
        private postrepo: IPostRepository,
        private acctrepo: IAccountRepository,
    ) {
        this.postrepo = postrepo;
        this.acctrepo = acctrepo;
    }

    async BanUser(userId: string): Promise<void> {
        this.acctrepo.BanUser(userId);
    }
    async DeleteUser(userId: string): Promise<void> {
        await this.acctrepo.deleteUser(userId);
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
