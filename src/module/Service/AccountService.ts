import { CustomError } from '@application/Error/Error';
import {
    StatusCode,
    decryptPassword,
    encryptPassword,
    generateAuthToken,
    generateOtpToken,
    generateRandomId,
    generateRandomOTP,
    getCurrentTimeStamp,
    verifyOtpToken,
} from '@application/Utils';
import {
    LogInDTO,
    SignUpDTO,
    UpdateInfoDTO,
    UpdatePassWordDTO,
    ResetPasswordDTO,
    VerifyOtpDTO,
} from '@module/Domain/DTO';
import { User, UserStatus } from '@module/Domain/Model';
import { IAccountRepository } from '@module/Domain/Repository';

export interface IAccountService {
    SignUp(data: SignUpDTO): Promise<void>;
    LogIn(data: LogInDTO): Promise<{ token: string; user: User }>;
    GetUser(userId: string): Promise<User>;
    UpdateInfo(data: UpdateInfoDTO, userId: string): Promise<User>;
    UpdatePassword(data: UpdatePassWordDTO, userId: string): Promise<void>;
    DeleteUser(userId: string): Promise<void>;
    ForgotPassword(email: string): Promise<void>;
    VerifyOTP(data: VerifyOtpDTO): Promise<{ token: string }>;
    ResetPassword(data: ResetPasswordDTO): Promise<void>;
}

export class AccountService implements IAccountService {
    constructor(private acctrepo: IAccountRepository) {
        this.acctrepo = acctrepo;
    }

    async SignUp(data: SignUpDTO): Promise<void> {
        const emailExists = await this.acctrepo.getUserByEmail(data.email);
        if (emailExists) {
            throw new CustomError('Acoount already exists, Log in instead.');
        }

        const userNameAvailable = await this.acctrepo.userNameAvalable(
            data.userName,
        );
        if (!userNameAvailable) {
            throw new CustomError(
                'User already exists, Choose a unique username.',
            );
        }
        const password = await encryptPassword(data.password);

        const userId = generateRandomId();
        const date = getCurrentTimeStamp();
        const user = {
            userId,
            userName: data.userName,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            password,
            isAdmin: false,
            status: UserStatus.ACTIVE,
            createdOn: date,
            lastModifiedOn: date,
            createdBy: `${data.userName} ${userId}`,
            modifiedBy: `${data.userName} ${userId}`,
        };
        await this.acctrepo.saveUser(user);
    }

    async LogIn(data: LogInDTO): Promise<{ token: string; user: User }> {
        const user = await this.acctrepo.getUserByEmail(data.email);

        if (!user) {
            throw new CustomError('Invalid username or password');
        }
        const validPassword = await decryptPassword(
            data.password,
            user.password as string,
        );
        if (!validPassword) {
            throw new CustomError('Invalid username or password');
        }
        const token = generateAuthToken(user.userId, user.email, user.isAdmin);

        delete user.password;

        return { token, user };
    }

    async GetUser(userId: string): Promise<User> {
        const user = await this.acctrepo.getUserById(userId);
        if (!user) {
            throw new CustomError('User not found', StatusCode.UNAUTHORIZED);
        }
        return user;
    }

    async UpdateInfo(data: UpdateInfoDTO, userId: string): Promise<User> {
        const userInfo = await this.acctrepo.getUserById(userId);
        if (!userInfo) {
            throw new CustomError('User not found', StatusCode.UNAUTHORIZED);
        }

        const date = getCurrentTimeStamp();
        const newUserInfo = {
            userId,
            userName: data.userName || userInfo.userName,
            email: userInfo.email,
            firstName: data.firstName || userInfo.firstName,
            lastName: data.lastName || userInfo.lastName,
            password: userInfo.password,
            isAdmin: userInfo.isAdmin,
            status: userInfo.status,
            lastModifiedOn: date,
            modifiedBy: `${data.userName} ${userInfo.userId}`,
        };
        await this.acctrepo.updateUser(newUserInfo);
        const newUser = await this.acctrepo.getUserById(userId);
        delete newUser.password;
        return newUser;
    }
    async UpdatePassword(
        data: UpdatePassWordDTO,
        userId: string,
    ): Promise<void> {
        const userInfo = await this.acctrepo.getUserById(userId);
        if (!userInfo) {
            throw new CustomError('User not found', StatusCode.UNAUTHORIZED);
        }

        const date = getCurrentTimeStamp();
        await this.acctrepo.updatePassword(userId, data.password, date);
    }

    async DeleteUser(userId: string): Promise<void> {
        await this.acctrepo.deleteUser(userId);
    }

    async ForgotPassword(email: string): Promise<void> {
        const userInfo = await this.acctrepo.getUserByEmail(email);
        if (!userInfo) {
            throw new CustomError(
                'Account associated with this email not found',
                StatusCode.UNAUTHORIZED,
            );
        }

        const otp = generateRandomOTP();
        const expiry = getCurrentTimeStamp() + 600; // expires in 10 minutes

        await this.acctrepo.deleteOTP(email);
        await this.acctrepo.saveOTP(email, otp, expiry);

        // add send email option
    }

    async VerifyOTP(data: VerifyOtpDTO): Promise<{ token: string }> {
        const savedOtp = await this.acctrepo.getOTP(data.email, data.otp);
        const date = getCurrentTimeStamp();
        if (!savedOtp || savedOtp.otp !== data.otp || date > savedOtp.expiry)
            throw new CustomError('Invalid OTP or expired');

        const token = generateOtpToken(data.email);
        return { token };
    }

    public async ResetPassword(data: ResetPasswordDTO): Promise<void> {
        const { email } = verifyOtpToken(data.otpToken);
        if (!email) {
            throw new CustomError('Token invalid or expired');
        }
        const user = await this.acctrepo.getUserByEmail(email);

        if (!user) {
            throw new CustomError('User not found', StatusCode.UNAUTHORIZED);
        }

        const date = getCurrentTimeStamp();

        await this.acctrepo.updatePassword(user.userId, data.newPassword, date);
    }
}
