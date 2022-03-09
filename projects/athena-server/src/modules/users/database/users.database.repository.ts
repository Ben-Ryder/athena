import { DeepPartial } from 'typeorm';

import { DatabaseRepository } from '../../../services/database/database.repository';

import { UserEntity } from './users.database.entity';
import { UserDto } from '../dtos/users.dto';
import { CreateUserDto } from '../dtos/create.user.dto';
import { UpdateUserDto } from '../dtos/update.users.dto';

export class UsersDatabaseRepository extends DatabaseRepository<UserEntity, UserDto, CreateUserDto, UpdateUserDto>{
  mapCreateEntityDtoToDatabaseEntity(createEntityDto: CreateUserDto): DeepPartial<UserEntity> {
    return {
      username: createEntityDto.username,
      email: createEntityDto.email,
      password: createEntityDto.password
    };
  }

  mapDatabaseEntityToEntityDto(databaseEntity: UserEntity): UserDto {
    return {
      id: databaseEntity.id,
      username: databaseEntity.username,
      email: databaseEntity.email,
      password: databaseEntity.password,
      isVerified: databaseEntity.isVerified,
      createdAt: databaseEntity.createdAt,
      updatedAt: databaseEntity.updatedAt
    };
  }

  mergeUpdateEntityDtoWithDatabaseEntity(databaseEntity: UserEntity, updateEntityDto: UpdateUserDto): DeepPartial<UserEntity> {
    return {
      ...databaseEntity,
      ...updateEntityDto
    };
  }
}
