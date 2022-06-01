import { createApp } from "./app";
import {ConfigService} from "./services/config/config";


async function startServer() {
    const kangoJS = await createApp();
    const app = kangoJS.getApp();

    const configService = kangoJS.dependencyContainer.useDependency<ConfigService>(ConfigService);

    // Start server listening for requests
    app.listen(configService.config.node.port, () => {
      console.log(`Server started. Listening on http://localhost:${configService.config.node.port}`);
    });
}
startServer();
