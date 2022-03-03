import { UsersDatabaseRepository } from './database/users.database.repository';
import { UserEntity } from './database/users.database.entity';

import { CreateUserDto } from './dtos/create.user.dto';
import { UpdateUserDto } from './dtos/update.users.dto';


export class UsersService {
    constructor(
       private userDatabaseRepository: UsersDatabaseRepository = new UsersDatabaseRepository(UserEntity)
    ) {}

    async getAll() {
        return this.userDatabaseRepository.getAll();
    }

    async get(userId: string) {
        return this.userDatabaseRepository.get(userId);
    }

    async add(createUserDto: CreateUserDto) {
        return this.userDatabaseRepository.add(createUserDto);
    }

    async update(userId: string, updateUserDto: UpdateUserDto) {
        return this.userDatabaseRepository.update(userId, updateUserDto);
    }

    async delete(noteId: string) {
        return this.userDatabaseRepository.delete(noteId);
    }
}
