import Joi from 'joi';

export const SignUpSchema = Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string().required(),
});
export const LogInSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});
export const UpdateInfoSchema = Joi.object({
    userName: Joi.string().optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
});
export const UpdatePassWordSchema = Joi.object({
    password: Joi.string().required(),
});
export const VerifyOtpSchema = Joi.object({
    email: Joi.string().required(),
    otp: Joi.string().required(),
});
export const ResetPasswordSchema = Joi.object({
    otpToken: Joi.string().required(),
    newPassword: Joi.string().required(),
});
export const SavePostSchema = Joi.object({
    post: Joi.string().required(),
});
