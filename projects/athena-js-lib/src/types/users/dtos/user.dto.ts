
export class UserDto {
    id!: string;
    username!: string;
    email!: string;
    isVerified!: boolean;
    createdAt!: Date;
    updatedAt!: Date;
}

/**
 * User DTO WITH PASSWORD
 * The backend needs access to password data but this should never be exposed
 * to any client, hence there are two interfaces to help prevent this from happening.
 */
export class UserWithPasswordDto {
    id!: string;
    username!: string;
    email!: string;
    isVerified!: boolean;
    createdAt!: Date;
    updatedAt!: Date;
    passwordHash!: string;
    passwordSalt!: string;
}
