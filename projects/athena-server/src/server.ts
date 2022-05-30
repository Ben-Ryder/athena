import { config } from "./config";

import { getApp } from "./app";


async function startServer() {
    const app = await getApp();

    // Start server listening for requests
    app.listen(config.node.port, () => {
            console.log(`Server started. Listening on http://localhost:${config.node.port}`);
        }
    );
}
startServer();
