import { UsersDatabaseRepository } from './database/users.database.repository';

import { Injectable } from "@kangojs/core";

import { PasswordService } from "../../services/password/password.service";
import { AccessForbiddenError } from "@kangojs/core";
import {CreateUserRequestSchema, GetUserResponse, UpdateUserRequestSchema, UserDto} from "@ben-ryder/athena-js-lib";
import {DatabaseUserDto} from "./dtos/database-user.dto-interface";
import {UpdateDatabaseUserDto} from "./dtos/update.database-user.dto-interface";


@Injectable()
export class UsersService {
    constructor(
       private userDatabaseRepository: UsersDatabaseRepository
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

        const user = await this.userDatabaseRepository.getById(userId);
        return this.removePasswordFromUser(user);
    }

    removePasswordFromUser(userWithPassword: DatabaseUserDto): UserDto {
        const { passwordHash, ...userDto } = userWithPassword;
        return userDto;
    }

    async getWithPasswordByUsername(username: string): Promise<DatabaseUserDto> {
        return this.userDatabaseRepository.get({
            username
        })
    }

    async add(createUserDto: CreateUserRequestSchema): Promise<UserDto> {
        const passwordHash = await PasswordService.hashPassword(createUserDto.password);

        const user = {
            username: createUserDto.username,
            email: createUserDto.email,
            encryptionSecret: createUserDto.encryptionSecret,
            passwordHash
        }

        const resultUser = await this.userDatabaseRepository.add(user);
        return this.removePasswordFromUser(resultUser);
    }

    async update(requestUserId: string, userId: string, updateUserDto: UpdateUserRequestSchema): Promise<void> {
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

        return this.userDatabaseRepository.update(userId, updateUserDto);
    }

    async delete(requestUserId: string, userId: string): Promise<void> {
        this.checkAccess(requestUserId, userId);
        return this.userDatabaseRepository.delete(userId);
    }
}
