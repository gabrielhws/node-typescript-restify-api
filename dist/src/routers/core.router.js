"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../middleware/router");
class CoreRouter extends router_1.Router {
  applyRoutes(app) {
    app.get("/", (req, res, next) => {
      res.send(200, {
        message: "RESTful NodeJs/TypeScript With Restify Sample running =D"
      });
      next();
    });
  }
}
exports.coreRouter = new CoreRouter();
