import {KangoJS} from '@kangojs/core';
import {ClassValidator} from '@kangojs/class-validation';
import {AuthValidator} from './modules/auth/auth.validator';
import { createServeSPAMiddleware } from "@kangojs/serve-spa";

import {AuthController} from "./modules/auth/auth.controller";
import {BaseController} from "./modules/base/base.controller";
import {UsersController} from "./modules/users/users.controller";
import {VaultsController} from "./modules/vaults/vaults.controller";


export async function createApp() {
  const serveSpaMiddleware = createServeSPAMiddleware({
    folderPath: "../../dashboard/build"
  });

  // Load all controllers and setup KangoJS.
  return new KangoJS({
    controllers: [
      BaseController,
      AuthController,
      UsersController,
      VaultsController
    ],
    middleware: [
      serveSpaMiddleware
    ],
    authValidator: AuthValidator,
    bodyValidator: ClassValidator,
    queryValidator: ClassValidator,
    paramsValidator: ClassValidator,
  });
}
