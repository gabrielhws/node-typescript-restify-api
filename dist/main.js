"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const log4js = require("log4js");
const log = log4js.getLogger('main');
const server = new server_1.Server();
server.bootstrap()
    .then(server => {
    log.info('API Restful with Restify running: %s', server.application.address().port);
})
    .catch(error => {
    log.fatal('Server failed to start');
    log.fatal(JSON.stringify(error));
    process.exit(1);
});
