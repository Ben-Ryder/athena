import { UsersDatabaseRepository } from './database/users.database.repository';

import { Injectable } from "@kangojs/core";

import { PasswordService } from "../../services/password/password.service";
import { AccessForbiddenError } from "@kangojs/core";
import {CreateUserDto, UpdateUserDto, UserDto, UserWithPasswordDto} from "@ben-ryder/athena-js-lib";
import {CreateUserWithPasswordDto, UpdateUserWithPasswordDto} from "@ben-ryder/athena-js-lib";


@Injectable()
export class UsersService {
    constructor(
       private userDatabaseRepository: UsersDatabaseRepository
    ) {}

    async getWithPassword(userId: string): Promise<UserWithPasswordDto> {
        return this.userDatabaseRepository.getById(userId);
    }

    checkAccess(requestUserId: string, userId: string): void {
        if (requestUserId !== userId) {
            throw new AccessForbiddenError({
                message: "Access forbidden to user"
            })
        }
    }

    async get(requestUserId: string, userId: string): Promise<UserDto|null> {
        this.checkAccess(requestUserId, userId);

        const user = await this.userDatabaseRepository.getById(userId);
        if (user) {
            return this.removePasswordFromUser(user);
        }
        return null;
    }

    removePasswordFromUser(userWithPassword: UserWithPasswordDto): UserDto {
        const { passwordHash, passwordSalt, ...userDto } = userWithPassword;
        return userDto;
    }

    async getWithPasswordByUsername(username: string): Promise<UserWithPasswordDto> {
        return this.userDatabaseRepository.get({
            username
        })
    }

    async add(createUserDto: CreateUserDto): Promise<UserDto> {

        const userWithPassword: CreateUserWithPasswordDto = {
            username: createUserDto.username,
            email: createUserDto.email,
            passwordHash: await PasswordService.hashPassword(createUserDto.password),
            passwordSalt: "erjbgaeljgeargaeg"
        }

        const resultUser = await this.userDatabaseRepository.add(userWithPassword);
        const { passwordHash, passwordSalt, ...userDto } = resultUser;
        return userDto;
    }

    async update(requestUserId: string, userId: string, updateUserDto: UpdateUserDto): Promise<void> {
        this.checkAccess(requestUserId, userId);

        if (updateUserDto.password) {
            updateUserDto.password = await PasswordService.hashPassword(updateUserDto.password);
        }

        const {password, ...updateUserDtoWithoutPassword } = updateUserDto;
        const updateUserWithPassword: UpdateUserWithPasswordDto = {
            ...updateUserDtoWithoutPassword
        };

        if (password) {
            updateUserWithPassword.passwordHash = await PasswordService.hashPassword(password);
        }

        return this.userDatabaseRepository.update(userId, updateUserDto);
    }

    async delete(requestUserId: string, userId: string): Promise<void> {
        this.checkAccess(requestUserId, userId);
        return this.userDatabaseRepository.delete(userId);
    }
}
