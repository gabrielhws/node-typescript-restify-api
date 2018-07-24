import { Router } from "../../middlewares/router";
import * as restify from "restify";

class CoreRouter extends Router {
  applyRoutes(app: restify.Server) {
    app.get("/", (req, res, next) => {
      res.send(200, {
        message: "RESTful NodeJs/TypeScript With Restify Sample running =D",
        routes: {
          categories: "/categories",
          core: "/",
          recipes: "/recipes",
          reviews: "/reviews",
          users: "/users"
        }
      });
      next();
    });
  }
}

export const coreRouter = new CoreRouter();
