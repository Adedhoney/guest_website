import { ResponseDTO, ResponseStatus } from '@application/Response/Response';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import bcrypt from 'bcrypt';
import path from 'path';
import * as jwt from 'jsonwebtoken';
import config from '@application/Config/config';
// import { Permission } from '@module/Domain/Model';

export enum StatusCode {
    SUCCESS = 200,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_ERROR = 500,
}

export const successResponse = (
    res: Response,
    message: string,
    data: object = {},
    code?: number,
) => {
    if (!code) code = StatusCode.SUCCESS;
    return res
        .status(code)
        .send(new ResponseDTO(ResponseStatus.SUCCESS, message, data));
};

export const errorResponse = (
    res: Response,
    message: string,
    code?: number,
) => {
    if (!code) code = StatusCode.SUCCESS;
    return res
        .status(code)
        .send(new ResponseDTO(ResponseStatus.ERROR, message));
};

export const generateRandomId = (): string => {
    return randomUUID();
};

export const encryptPassword = async (password: string) => {
    return await bcrypt.hash(password, 8);
};

export const decryptPassword = async (
    password: string,
    hashedPassword: string,
) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const getFileRootDir = (dir: string) => {
    return path.join(__dirname, dir);
};

export const generateAuthToken = (
    userId: string,
    email: string,
    isAdmin: boolean,
): string => {
    return jwt.sign(
        { userId, email, isAdmin },
        config.JWT.secret as jwt.Secret,
        {
            expiresIn: '24h',
        },
    );
};
export const generateOtpToken = (email: string): string => {
    return jwt.sign({ email }, config.JWT.secret as jwt.Secret, {
        expiresIn: 300,
    });
};
export const verifyOtpToken = (token: string) => {
    return jwt.verify(token, config.JWT.secret as jwt.Secret) as {
        email: string;
    };
};

export interface ITokenPayload extends jwt.JwtPayload {
    userId: string;
    email: string;
    isAdmin: boolean;
}

export const verifyAuthToken = (token: string) => {
    return jwt.verify(token, config.JWT.secret as jwt.Secret) as ITokenPayload;
};

export const getCurrentTimeStamp = () => {
    return Math.floor(+new Date() / 1000).toString();
};
export const generateRandomOTP = () => {
    const min = 1000;
    const max = 9999;
    return `${Math.floor(Math.random() * (max - min + 1)) + min}`;
};
