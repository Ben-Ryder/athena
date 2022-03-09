import path from 'path';
import express from 'express';

import { KangoJS } from '@kangojs/kangojs';
import { createBodyValidator, createParamsValidator, createQueryValidator } from '@kangojs/class-validation';
import { useCommonMiddleware, useNotFoundMiddleware } from '@kangojs/common-middleware';
import { useServeSPA } from '@kangojs/serve-spa';
import { useErrorHandlerMiddleware } from "@kangojs/error-handler";
import { useAuthValidator } from './modules/auth/auth.middleware';


export default async function App() {
    const app = express();

    // Middleware Setup
    await useCommonMiddleware(app);

    // Load all controllers and setup KangoJS.
    const kangoJS = new KangoJS({
        controllerFilesGlob: path.join(__dirname, 'modules/**/*.controller.{ts,js}'),
        authValidator: useAuthValidator(),
        bodyValidator: createBodyValidator(),
        queryValidator: createQueryValidator(),
        paramsValidator: createParamsValidator()
    });
    await kangoJS.boostrap(app);

    // API 404 handling.
    await useNotFoundMiddleware(app);

    // Setup serving of the web app.
    useServeSPA(app, {
        folderPath: '../../athena-web/build'
    })

    // Global Error Handling
    // todo: add custom logger from services
    useErrorHandlerMiddleware(app);

    return app;
};
