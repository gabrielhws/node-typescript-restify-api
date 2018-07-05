import { config } from "../config/env/all";
import { DB } from "../src/middleware/db";
import * as restify from "restify";
import * as log4js from "log4js";
import { Router } from "../src/middleware/router";
import { mergePatchBodyParser } from "../src/helpers/merge-patch-parser.helper";
import { handleError } from "../src/middleware/error.handler";

const log = log4js.getLogger("server");

export class Server {
  public app: restify.Server;

  private static initDb() {
    const db = new DB();
    return db
      .conn()
      .then(() => {})
      .catch(err => {
        log.error(JSON.stringify(err));
      });
  }

  private initRoutes(routers): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.app = restify.createServer({
          name: "typescript-restify-api",
          version: "1.0.0"
        });
        this.app.use(restify.plugins.queryParser());
        this.app.use(restify.plugins.bodyParser());
        this.app.use(mergePatchBodyParser);
        this.app.on("restifyError", handleError);

        for (let router of routers) {
          router.applyRoutes(this.app);
        }

        this.app.listen(config.port, () => {
          resolve(this.app);
        });
      } catch (error) {
        log.fatal("Error in Init Routes: %s", JSON.stringify(error));
        reject(error);
      }
    });
  }

  public bootstrap(routers: Router[] = []): Promise<any> {
    return Server.initDb()
      .then(() => {
        return this.initRoutes(routers).then(() => this);
      })
      .catch(err => {
        log.error(JSON.stringify(err));
      });
  }
}
