
export class UpdateUserDto {
    username?: string;
    email?: string;
    isVerified?: boolean;
    password?: string;
}

export interface UpdateUserWithPasswordDto {
    username?: string;
    email?: string;
    isVerified?: boolean;
    passwordHash?: string;
    passwordSalt?: string;
}
