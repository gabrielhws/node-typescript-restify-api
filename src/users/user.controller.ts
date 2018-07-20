import { User } from "./user.model";
import * as log4js from "log4js";
import { NotFoundError } from "restify-errors";

const log = log4js.getLogger("user-controller");

export class UserController {
  findAddress = (req, res, next) => {
    log.trace("Enter in Find Address");
    const id = req.params.id;
    User.findById(id, "+address")
      .then(user => {
        if (!user) {
          throw new NotFoundError("User not found");
        } else {
          res.json(user.address);
          return next();
        }
      })
      .catch(next);
  };

  replaceAddress = (req, res, next) => {
    const id = req.params.id;
    const body = req.body;

    User.findById(id)
      .then(user => {
        if (!user) {
        } else {
          user.address = body;
          return user.save();
        }
      })
      .then(user => {
        res.json(user.address);
        return next();
      })
      .catch(next);
  };
}

export const users = new UserController();
