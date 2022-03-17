import { UsersDatabaseRepository } from './database/users.database.repository';
import { UserEntity } from './database/users.database.entity';

import { ExposedUserDto } from "./dtos/exposed.user.dto";
import { CreateUserDto } from './dtos/create.user.dto';
import { UpdateUserDto } from './dtos/update.user.dto';
import { UserDto } from './dtos/user.dto';

import { PasswordService } from "../../services/password/password.service";
import { AccessForbiddenError } from "@kangojs/error-handler";

export class UsersService {
    constructor(
       private userDatabaseRepository: UsersDatabaseRepository = new UsersDatabaseRepository(UserEntity)
    ) {}

    async getFull(userId: string) {
        return this.userDatabaseRepository.getById(userId);
    }

    checkAccess(requestUserId: string, userId: string) {
        if (requestUserId !== userId) {
            throw new AccessForbiddenError({
                message: "Access forbidden to user"
            })
        }
    }

    async get(requestUserId: string, userId: string,): Promise<ExposedUserDto|null> {
        this.checkAccess(requestUserId, userId);

        const user = await this.userDatabaseRepository.getById(userId);
        if (user) {
            return this.makeUserPublic(user);
        }
        return null;
    }

    makeUserPublic(userDto: UserDto): ExposedUserDto {
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

    async update(requestUserId: string, userId: string, updateUserDto: UpdateUserDto) {
        this.checkAccess(requestUserId, userId);

        if (updateUserDto.password) {
            updateUserDto.password = await PasswordService.hashPassword(updateUserDto.password);
        }

        return this.userDatabaseRepository.update(userId, updateUserDto);
    }

    async delete(requestUserId: string, userId: string) {
        this.checkAccess(requestUserId, userId);
        return this.userDatabaseRepository.delete(userId);
    }
}
