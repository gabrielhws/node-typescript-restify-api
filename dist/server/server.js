"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config/config");
const db_1 = require("../middlewares/db");
const restify = require("restify");
const log4js = require("log4js");
const merge_patch_parser_helper_1 = require("../helpers/merge-patch-parser.helper");
const error_handler_1 = require("../middlewares/error.handler");
const log = log4js.getLogger('server');
class Server {
    static initDb() {
        const db = new db_1.DB();
        return db
            .conn()
            .then(() => { })
            .catch((err) => {
            log.error(JSON.stringify(err));
        });
    }
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                this.app = restify.createServer({
                    name: 'typescript-restify-api',
                    version: '1.0.0',
                });
                this.app.use(restify.plugins.queryParser());
                this.app.use(restify.plugins.bodyParser());
                this.app.use(merge_patch_parser_helper_1.mergePatchBodyParser);
                this.app.on('restifyError', error_handler_1.handleError);
                for (let router of routers) {
                    router.applyRoutes(this.app);
                }
                this.app.listen(config_1.default.port, () => {
                    resolve(this.app);
                });
            }
            catch (error) {
                log.fatal('Error in Init Routes: %s', JSON.stringify(error));
                reject(error);
            }
        });
    }
    bootstrap(routers = []) {
        return Server.initDb()
            .then(() => {
            return this.initRoutes(routers).then(() => this);
        })
            .catch((err) => {
            log.error(JSON.stringify(err));
        });
    }
}
exports.Server = Server;
