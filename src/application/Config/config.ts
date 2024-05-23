// import { getFileRootDir } from '@application/Utils';
import dotenv from 'dotenv';

dotenv.config();

const envs = [
    'DB_URI',
    'DB_NAME',
    'JWT_SECRET',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USERNAME',
    'SMTP_PASSWORD',
];

envs.forEach((value, index) => {
    if (!process.env[envs[index]]) {
        const message = 'Fatal Error: env ' + envs[index] + ' not define';

        throw new Error(message);
    }
});

export default {
    ENVIRONMENT: process.env.NODE_ENV,
    PORT: Number(process.env.PORT),
    DATABASE: {
        URI: process.env.DB_URI,
        DB_NAME: process.env.DB_NAME,
    },
    JWT: { secret: process.env.JWT_SECRET },
    SMTP: {
        host: process.env.SMTP_HOST as string,
        port: Number(process.env.SMTP_PORT),
        username: process.env.SMTP_USERNAME as string,
        password: process.env.SMTP_PASSWORD as string,
    },
};
