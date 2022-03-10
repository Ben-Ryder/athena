import { UsersDatabaseRepository } from './database/users.database.repository';
import { UserEntity } from './database/users.database.entity';

import { PublicUserDto } from "./dtos/public.users.dto";
import { CreateUserDto } from './dtos/create.user.dto';
import { UpdateUserDto } from './dtos/update.users.dto';

import { PasswordService } from "../../services/password/password.service";

export class UsersService {
    constructor(
       private userDatabaseRepository: UsersDatabaseRepository = new UsersDatabaseRepository(UserEntity)
    ) {}

    async getFull(userId: string) {
        return this.userDatabaseRepository.getById(userId);
    }

    async get(userId: string): Promise<PublicUserDto|null> {
        const user = await this.userDatabaseRepository.getById(userId);
        if (user) {
            const { password, ...publicUserDto } = user;
            return publicUserDto;
        }
        return null;
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

    async update(userId: string, updateUserDto: UpdateUserDto) {
        if (updateUserDto.password) {
            updateUserDto.password = await PasswordService.hashPassword(updateUserDto.password);
        }

        return this.userDatabaseRepository.update(userId, updateUserDto);
    }

    async delete(noteId: string) {
        return this.userDatabaseRepository.delete(noteId);
    }
}
