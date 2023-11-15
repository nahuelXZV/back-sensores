import { AppRoutes } from "./config/routes";
import { Server } from "./config/server";

(async () => {
    main();
})();

function main() {
    const server = new Server({
        port: 3000,
        public_path: 'public',
        routes: AppRoutes.routes,
    });
    server.start();
}