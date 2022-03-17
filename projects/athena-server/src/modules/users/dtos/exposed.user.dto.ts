/**
 * The user DTO that can be exposed to a user (without the password hash).
 */
export class ExposedUserDto {
    id!: string;
    username!: string;
    email!: string;
    isVerified!: boolean;
    createdAt!: Date;
    updatedAt!: Date;
}
