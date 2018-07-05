"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../middleware/router");
const restify_errors_1 = require("restify-errors");
const user_model_1 = require("../models/user.model");
const log4js = require("log4js");
const log = log4js.getLogger("user-route");
class UserRouter extends router_1.Router {
  constructor() {
    super();
    this.on("beforeRender", document => {
      delete document.providers.sample.password;
      delete document.providers.sample.resetPasswordToken;
      delete document.providers.sample.resetPasswordExpires;
      delete document.verified_token;
      delete document.verified_token_expires;
    });
  }
  applyRoutes(app) {
    app.get("/users", (req, res, next) => {
      user_model_1.User.find()
        .then(this.render(res, next))
        .catch(next);
    });
    app.post("/users", (req, res, next) => {
      let user = new user_model_1.User(req.body);
      user
        .save()
        .then(this.render(res, next))
        .catch(next);
    });
    app.get("/users/:id", (req, res, next) => {
      const id = req.params.id;
      user_model_1.User.findById(id)
        .then(this.render(res, next))
        .catch(next);
    });
    app.put("/users/:id", (req, res, next) => {
      const id = req.params.id;
      const body = req.body;
      const options = {
        overwrite: true,
        runValidators: true
      };
      user_model_1.User.update({ _id: id }, body, options)
        .exec()
        .then(result => {
          if (result.n) {
            return user_model_1.User.findById(id);
          } else {
            throw new restify_errors_1.NotFoundError("User not found");
          }
        })
        .then(this.render(res, next))
        .catch(next);
    });
    app.patch("/users/:id", (req, res, next) => {
      const options = {
        new: true,
        runValidators: true
      };
      user_model_1.User.findByIdAndUpdate(req.params.id, req.body, options)
        .then(this.render(res, next))
        .catch(next);
    });
    app.del("/users/:id", (req, res, next) => {
      const id = req.params.id;
      user_model_1.User.remove({ _id: id })
        .exec()
        .then(cmdResult => {
          if (cmdResult.result.n) {
            res.send(204);
          } else {
            throw new restify_errors_1.NotFoundError("User not found");
          }
          return next();
        })
        .catch(next);
    });
  }
}
exports.userRouter = new UserRouter();
