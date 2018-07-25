import { Model } from "../../middlewares/model";
import * as restify from "restify";
import { User } from "./user.model";
import { users } from "./user.controller";
import * as log4js from "log4js";
const log = log4js.getLogger("user-router");

class UserRouter extends Model<User> {
  constructor() {
    super(User);
    this.on("beforeRender", document => {
      delete document.providers.sample.password;
      delete document.providers.sample.resetPasswordToken;
      delete document.providers.sample.resetPasswordExpires;
      delete document.verified_token;
      delete document.verified_token_expires;
    });
  }

  envelope(document) {
    log.trace("Enter in Envelope");
    let resource = super.envelope(document);
    resource._links.address = `${this.basePath}/${resource._id}/address`;
    return resource;
  }

  applyRoutes(app: restify.Server) {
    app.get({ path: "/users", version: "2.0.0" }, [
      users.findByEmail,
      this.findAll
    ]);
    app.post("/users", this.create);
    app.get("/users/:id", [this.validateId, this.findById]);
    app.put("/users/:id", [this.validateId, this.replace]);
    app.patch("/users/:id", [this.validateId, this.update]);
    app.del("/users/:id", [this.validateId, this.delete]);

    app.get("/users/:id/address", [this.validateId, users.findAddress]);
    app.put("/users/:id/address", [this.validateId, users.replaceAddress]);
  }
}

export const userRouter = new UserRouter();
