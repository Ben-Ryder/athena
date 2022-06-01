import { DeepPartial } from 'typeorm';

import { Injectable } from "@kangojs/core";

import { DatabaseRepository } from '../../../services/database/database.repository';

import { UserEntity } from './users.database.entity';
import { UserDto } from '../dtos/user.dto';
import { CreateUserDto } from '../dtos/create.user.dto';
import { UpdateUserDto } from '../dtos/update.user.dto';
import {DatabaseService} from "../../../services/database/database.service";


@Injectable()
export class UsersDatabaseRepository extends DatabaseRepository<UserEntity, UserDto, CreateUserDto, UpdateUserDto>{
  constructor(
    private databaseService: DatabaseService
  ) {
    super(UserEntity, databaseService);
  }

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
