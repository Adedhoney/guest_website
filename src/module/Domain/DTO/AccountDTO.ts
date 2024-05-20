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
    email: string;
    password: string;
}
