import { Server } from "./server/server";
import * as log4js from "log4js";
import { Routes } from "./src/middleware/routes";

const server = new Server();

const log = log4js.getLogger("main");

server
  .bootstrap(Routes)
  .then(server => {
    log.info("API Restful with Restify running: %s", server.app.address().port);
  })
  .catch(error => {
    log.error("Server failed to start");
    log.fatal(JSON.stringify(error));
    process.exit(1);
  });
