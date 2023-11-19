import { Server } from "./config/server";

(async () => {
    main();
})();

function main() {
    const server = new Server({
        port: 3000,
    });
    server.start();
}