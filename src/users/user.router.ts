import { Model } from "../../middlewares/model";
import * as restify from "restify";
import { User } from "./user.model";
import { users } from "./user.controller";

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
