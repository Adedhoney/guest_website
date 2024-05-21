export interface SignUpDTO {
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface LogInDTO {
    email: string;
    password: string;
}
export interface UpdateInfoDTO {
    userName?: string;
    firstName?: string;
    lastName?: string;
}
export interface UpdatePassWordDTO {
    password: string;
}

export interface verifyOtpDTO {
    email: string;
    otp: string;
}
export interface resetPasswordDTO {
    otpToken: string;
    newPassword: string;
}
