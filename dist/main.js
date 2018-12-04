"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const log4js = require("log4js");
const routes_1 = require("./middlewares/routes");
const server = new server_1.Server();
const log = log4js.getLogger('main');
//Mock the translate function temporary
function __(text) {
    return text;
}
const _global = global;
_global.__ = __;
server
    .bootstrap(routes_1.Routes)
    .then((server) => {
    log.info('API Restful with Restify running: %s', server.app.address().port);
})
    .catch((error) => {
    log.error('Server failed to start');
    log.fatal(JSON.stringify(error));
    process.exit(1);
});
