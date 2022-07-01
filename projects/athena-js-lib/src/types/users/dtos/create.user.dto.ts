
export class CreateUserDto {
    username!: string;
    email!: string;
    password!: string;
}

export class CreateUserWithPasswordDto {
    username!: string;
    email!: string;
    passwordHash!: string;
    passwordSalt!: string;
}
