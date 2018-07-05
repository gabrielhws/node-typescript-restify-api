"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../../middleware/router");
class UserRouter extends router_1.Router {
  applyRoutes(app) {
    app.get("/users/me", (req, resp, next) => {});
  }
}
