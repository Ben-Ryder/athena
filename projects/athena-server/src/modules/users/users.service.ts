import { UsersDatabaseRepository } from './database/users.database.repository';
import { UserEntity } from './database/users.database.entity';

import { PublicUserDto } from "./dtos/public.users.dto";
import { CreateUserDto } from './dtos/create.user.dto';
import { UpdateUserDto } from './dtos/update.users.dto';
import { UserDto } from './dtos/users.dto';

import { PasswordService } from "../../services/password/password.service";
import { AccessForbiddenError } from "@kangojs/error-handler";

export class UsersService {
    constructor(
       private userDatabaseRepository: UsersDatabaseRepository = new UsersDatabaseRepository(UserEntity)
    ) {}

    async getFull(userId: string) {
        return this.userDatabaseRepository.getById(userId);
    }

    async get(currentUserId: string, userId: string,): Promise<PublicUserDto|null> {
        if (userId !== currentUserId) {
            throw new AccessForbiddenError({
                message: "Access forbidden to user account fetch"
            })
        }

        const user = await this.userDatabaseRepository.getById(userId);
        if (user) {
            return this.makeUserPublic(user);
        }
        return null;
    }

    makeUserPublic(userDto: UserDto): PublicUserDto {
        const { password, ...publicUserDto } = userDto;
        return publicUserDto;
    }

    async getFullByUsername(username: string) {
        return this.userDatabaseRepository.get({
            username
        })
    }

    async add(createUserDto: CreateUserDto) {
        createUserDto.password = await PasswordService.hashPassword(createUserDto.password);

        const resultUser = await this.userDatabaseRepository.add(createUserDto);
        const { password, ...publicUserDto } = resultUser;
        return publicUserDto;
    }

    async update(currentUserId: string, userId: string, updateUserDto: UpdateUserDto) {
        if (userId !== currentUserId) {
            throw new AccessForbiddenError({
                message: "Access forbidden to user account update"
            })
        }

        if (updateUserDto.password) {
            updateUserDto.password = await PasswordService.hashPassword(updateUserDto.password);
        }

        return this.userDatabaseRepository.update(userId, updateUserDto);
    }

    async delete(currentUserId: string, userId: string) {
        if (userId !== currentUserId) {
            throw new AccessForbiddenError({
                message: "Access forbidden to user account deletion"
            })
        }

        return this.userDatabaseRepository.delete(userId);
    }
}
