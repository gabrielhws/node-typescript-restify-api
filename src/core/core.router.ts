import { Router } from "../../middlewares/router";
import * as restify from "restify";

class CoreRouter extends Router {
  applyRoutes(app: restify.Server) {
    app.get("/", (req, res, next) => {
      res.send(200, {
        message: "RESTful NodeJs/TypeScript With Restify Sample running =D"
      });
      next();
    });
  }
}

export const coreRouter = new CoreRouter();
