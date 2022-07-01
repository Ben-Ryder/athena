import { DeepPartial } from 'typeorm';

import { Injectable } from "@kangojs/core";

import { DatabaseRepository } from '../../../services/database/database.repository';

import { UserEntity } from './users.database.entity';
import {DatabaseService} from "../../../services/database/database.service";
import {UserWithPasswordDto, CreateUserWithPasswordDto, UpdateUserWithPasswordDto} from "@ben-ryder/athena-js-lib";


@Injectable()
export class UsersDatabaseRepository extends DatabaseRepository<UserEntity, UserWithPasswordDto, CreateUserWithPasswordDto, UpdateUserWithPasswordDto> {
  constructor(
    private databaseService: DatabaseService
  ) {
    super(UserEntity, databaseService);
  }

  mapCreateEntityDtoToDatabaseEntity(createEntityDto: CreateUserWithPasswordDto): DeepPartial<UserEntity> {
    return {
      username: createEntityDto.username,
      email: createEntityDto.email,
      passwordHash: createEntityDto.passwordHash,
      passwordSalt: createEntityDto.passwordSalt
    };
  }

  mapDatabaseEntityToEntityDto(databaseEntity: UserEntity): UserWithPasswordDto {
    return {
      id: databaseEntity.id,
      username: databaseEntity.username,
      email: databaseEntity.email,
      passwordHash: databaseEntity.passwordHash,
      passwordSalt: databaseEntity.passwordSalt,
      isVerified: databaseEntity.isVerified,
      createdAt: databaseEntity.createdAt,
      updatedAt: databaseEntity.updatedAt
    };
  }

  mergeUpdateEntityDtoWithDatabaseEntity(databaseEntity: UserEntity, updateEntityDto: UpdateUserWithPasswordDto): DeepPartial<UserEntity> {
    return {
      ...databaseEntity,
      ...updateEntityDto
    };
  }
}
