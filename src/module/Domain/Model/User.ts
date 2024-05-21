export interface User {
    _id?: number;
    userId: string;
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    isAdmin: boolean;
    status: string;
    createdOn?: string;
    lastModifiedOn?: string;
    createdBy?: string;
    modifiedBy?: string;
}

export interface OTP {
    email: string;
    otp: string;
    expiry: string;
}
export enum UserStatus {
    BANNED = 'BANNED',
    ACTIVE = 'ACTIVE',
}
