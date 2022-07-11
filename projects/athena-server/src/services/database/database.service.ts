/**
 * Provides the base database functionality used by database repositories.
 */

import { Injectable } from "@kangojs/core";

import { ConfigService } from "../config/config";
import postgres, {Sql} from "postgres";

@Injectable()
export class DatabaseService {
  private sql: Sql<any> | null = null;

  constructor(
    private configService: ConfigService
  ) {}

  public async getSQL() {
    if (this.sql) {
      return this.sql
    }

    this.sql = postgres(this.configService.config.database.url);
    return this.sql;
  }
}
