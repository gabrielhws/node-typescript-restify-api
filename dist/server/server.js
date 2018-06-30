"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const all_1 = require("../config/env/all");
const restify = require("restify");
const mongoose = require("mongoose");
const log4js = require("log4js");
const log = log4js.getLogger('server');
class Server {
    initDb() {
        return mongoose.connect(all_1.config.database.host, {});
    }
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                this.app = restify.createServer({
                    name: 'typescript-restify-api',
                    version: '1.0.0'
                });
                this.app.use(restify.plugins.queryParser());
                for (let router of routers) {
                    router.applyRoutes(this.app);
                }
                this.app.listen(all_1.config.port, () => {
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
        return this.initDb()
            .then(() => this.initRoutes(routers).then(() => this));
    }
}
exports.Server = Server;
