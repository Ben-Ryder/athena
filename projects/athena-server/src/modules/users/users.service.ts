import { Injectable } from "@kangojs/core";
import { AccessForbiddenError } from "@kangojs/core";

import {CreateUserRequestSchema, GetUserResponse, UpdateUserRequestSchema, UserDto} from "@ben-ryder/athena-js-lib";

import { PasswordService } from "../../services/password/password.service";
import {DatabaseUserDto} from "./dtos/database-user.dto-interface";
import {UpdateDatabaseUserDto} from "./dtos/update.database-user.dto-interface";
import {UsersDatabaseService} from "./database/users.database.service";


@Injectable()
export class UsersService {
    constructor(
       private usersDatabaseService: UsersDatabaseService
    ) {}

    checkAccess(requestUserId: string, userId: string): void {
        if (requestUserId !== userId) {
            throw new AccessForbiddenError({
                message: "Access forbidden to user"
            })
        }
    }

    async get(requestUserId: string, userId: string): Promise<GetUserResponse> {
        this.checkAccess(requestUserId, userId);

        const user = await this.usersDatabaseService.get(userId);
        return this.removePasswordFromUser(user);
    }

    removePasswordFromUser(userWithPassword: DatabaseUserDto): UserDto {
        const { passwordHash, ...userDto } = userWithPassword;
        return userDto;
    }

    async getWithPasswordByUsername(username: string): Promise<DatabaseUserDto> {
        return this.usersDatabaseService.getByUsername(username);
    }

    async add(createUserDto: CreateUserRequestSchema): Promise<UserDto> {
        const passwordHash = await PasswordService.hashPassword(createUserDto.password);

        const user = {
            username: createUserDto.username,
            email: createUserDto.email,
            encryptionSecret: createUserDto.encryptionSecret,
            passwordHash
        }

        const resultUser = await this.usersDatabaseService.create(user);
        return this.removePasswordFromUser(resultUser);
    }

    async update(requestUserId: string, userId: string, updateUserDto: UpdateUserRequestSchema): Promise<UserDto> {
        this.checkAccess(requestUserId, userId);

        let newPasswordHash: string|null = null;
        if (updateUserDto.password) {
            newPasswordHash = await PasswordService.hashPassword(updateUserDto.password);

            // Replace the password field with the .passwordHash field
            delete updateUserDto.password;
        }

        const updatedUser: UpdateDatabaseUserDto = {...updateUserDto};
        if (newPasswordHash) {
            updatedUser.passwordHash = newPasswordHash;
        }

        const user = await this.usersDatabaseService.update(userId, updateUserDto);
        return this.removePasswordFromUser(user);
    }

    async delete(requestUserId: string, userId: string): Promise<void> {
        this.checkAccess(requestUserId, userId);
        return this.usersDatabaseService.delete(userId);
    }
}
