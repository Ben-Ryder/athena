import { DeepPartial } from 'typeorm';

import { Injectable } from "@kangojs/core";

import { DatabaseRepository } from '../../../services/database/database.repository';

import { UserEntity } from './users.database.entity';
import {DatabaseService} from "../../../services/database/database.service";
import {DatabaseUserDto} from "../dtos/database-user.dto-interface";
import {CreateDatabaseUserDto} from "../dtos/create.database-user.dto-interface";
import {UpdateDatabaseUserDto} from "../dtos/update.database-user.dto-interface";


@Injectable()
export class UsersDatabaseRepository extends DatabaseRepository<UserEntity, DatabaseUserDto, CreateDatabaseUserDto, UpdateDatabaseUserDto> {
  constructor(
    private databaseService: DatabaseService
  ) {
    super(UserEntity, databaseService);
  }

  mapCreateEntityDtoToDatabaseEntity(createEntityDto: CreateDatabaseUserDto): DeepPartial<UserEntity> {
    return {
      username: createEntityDto.username,
      email: createEntityDto.email,
      passwordHash: createEntityDto.passwordHash,
      encryptionSecret: createEntityDto.encryptionSecret,
    };
  }

  mapDatabaseEntityToEntityDto(databaseEntity: UserEntity): DatabaseUserDto {
    return {
      id: databaseEntity.id,
      username: databaseEntity.username,
      email: databaseEntity.email,
      passwordHash: databaseEntity.passwordHash,
      encryptionSecret: databaseEntity.encryptionSecret,
      isVerified: databaseEntity.isVerified,
      createdAt: databaseEntity.createdAt,
      updatedAt: databaseEntity.updatedAt
    };
  }

  mergeUpdateEntityDtoWithDatabaseEntity(databaseEntity: UserEntity, updateEntityDto: UpdateDatabaseUserDto): DeepPartial<UserEntity> {
    return {
      ...databaseEntity,
      ...updateEntityDto
    };
  }
}
