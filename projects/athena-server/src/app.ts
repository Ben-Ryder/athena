import path from 'path';
import express from 'express';

import { KangoJS } from '@kangojs/kangojs';
import { createBodyValidator, createQueryValidator } from '@kangojs/class-validation';
import { useCommonMiddleware, useNotFoundMiddleware } from '@kangojs/common-middleware';
import { useServeSPA } from '@kangojs/serve-spa';

import { errorMiddleware } from "./services/errors/error.middleware";


export default async function App() {
    const app = express();

    // Middleware Setup
    await useCommonMiddleware(app);

    // Load all controllers and setup KangoJS.
    const kangoJS = new KangoJS({
        controllerFilesGlob: path.join(__dirname, 'modules/**/*.controller.{ts,js}'),
        bodyValidator: createBodyValidator(),
        queryValidator: createQueryValidator()
    });
    await kangoJS.boostrap(app);

    // API 404 handling.
    await useNotFoundMiddleware(app, {
        path: '/api'
    });

    // Setup serving of the web app.
    useServeSPA(app, {
        folderPath: '../../athena-web/build'
    })

    // Global Error Handling
    app.use(errorMiddleware);

    return app;
};
