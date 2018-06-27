"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const all_1 = require("../config/env/all");
const restify = require("restify");
const log4js = require("log4js");
const log = log4js.getLogger('server-ts');
class Server {
    initRoutes() {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'typescript-restify-api',
                    version: '1.0.0'
                });
                this.application.use(restify.plugins.queryParser());
                this.application.get('/', (req, resp, next) => {
                    resp.send(200, { message: 'RESTful NodeJs/TypeScript With Restify Sample running =D' });
                    next();
                });
                this.application.listen(all_1.default.port, () => {
                    resolve(this.application);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    bootstrap() {
        return this.initRoutes().then(() => this);
    }
}
exports.Server = Server;
