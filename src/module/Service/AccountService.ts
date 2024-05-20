import { LogInDTO, SignUpDTO } from '@module/Domain/DTO';
import { User } from '@module/Domain/Model';

export interface IAccountService {
    signUp(data: SignUpDTO): Promise<User>;
    logIn(data: LogInDTO): Promise<User>;
    updateInfo(data: LogInDTO): Promise<User>;
    deleteUser(userId: string): Promise<void>;
    forgotPassword(userId: string): Promise<void>;
    // resetPassword{}
}
