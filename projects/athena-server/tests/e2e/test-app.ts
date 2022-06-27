import { agent as _request } from "supertest"
import {KangoJS} from "@kangojs/core";
import {createServeSPAMiddleware} from "@kangojs/serve-spa";
import {BaseController} from "../../src/modules/base/base.controller";
import {AuthController} from "../../src/modules/auth/auth.controller";
import {NotesController} from "../../src/modules/notes/notes.controller";
import {UsersController} from "../../src/modules/users/users.controller";
import {AuthValidator} from "../../src/modules/auth/auth.validator";
import {ClassValidator} from "@kangojs/class-validation";
import {ConfigService, config, ConfigInterface} from "../../src/services/config/config";
import {DatabaseService} from "../../src/services/database/database.service";

class KangoJSTest extends KangoJS {
  async clearData() {
    const databaseService = this.dependencyContainer.useDependency(DatabaseService);
    const connection = await databaseService.getConnection();

    // todo: write full truncate query
    await connection.query("TRUNCATE")
  }
}

class TestConfigService extends ConfigService {
  config: ConfigInterface = {
    ...config,
    database: {
      url: process.env.TESTING_DATABASE_URL as string
    },
    cache: {
      redisUrl: process.env.TESTING_REDIS_URL as string
    },
  }
}

export const getTestApp = async function() {
  const serveSpaMiddleware = createServeSPAMiddleware({
    folderPath: "../../dashboard/build"
  });

  const kangoJSApp = new KangoJSTest({
    dependencyOverrides: [
      {
        original: ConfigService,
        override: TestConfigService
      }
    ],
    controllers: [
      BaseController,
      AuthController,
      NotesController,
      UsersController
    ],
    middleware: [
      serveSpaMiddleware
    ],
    authValidator: AuthValidator,
    bodyValidator: ClassValidator,
    queryValidator: ClassValidator,
    paramsValidator: ClassValidator
  });
  const expressApp = kangoJSApp.getApp();

  return {
    kangoJSApp,
    testApp: _request(expressApp)
  };
};
