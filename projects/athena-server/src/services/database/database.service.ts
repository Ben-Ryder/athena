/**
 * Provides the base database functionality used by database repositories.
 */

import { createConnection, Connection } from 'typeorm';

import { Injectable } from "@kangojs/core";

import { ConfigService } from "../config/config";
import { NoteEntity } from "../../modules/notes/database/notes.database.entity";
import { UserEntity } from "../../modules/users/database/users.database.entity";

@Injectable()
export class DatabaseService {
  connection: Connection | null;

  constructor(
    private configService: ConfigService
  ) {
    this.connection = null;
  }

  public async getConnection() {
    if (this.connection) {
      return this.connection
    }

    this.connection = await createConnection({
      type: "postgres",
      url: this.configService.config.database.url,
      entities: [
          NoteEntity,
          UserEntity
      ],
      synchronize: this.configService.config.database.sync,
      logging: false,
    });

    return this.connection;
  }
}
