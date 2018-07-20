import { Router } from "./router";
import * as mongoose from "mongoose";
import { NotFoundError } from "restify-errors";

export abstract class Model<D extends mongoose.Document> extends Router {
  constructor(protected model: mongoose.Model<D>) {
    super();
  }

  validateId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      next(new NotFoundError("Document not found or Id invalid"));
    } else {
      next();
    }
  };

  findAll = (req, res, next) => {
    this.model
      .find()
      .then(this.renderAll(res, next))
      .catch(next);
  };

  findById = (req, res, next) => {
    const id = req.params.id;
    this.model
      .findById(id)
      .then(this.render(res, next))
      .catch(next);
  };

  create = (req, res, next) => {
    let document = new this.model(req.body);

    document
      .save()
      .then(this.render(res, next))
      .catch(next);
  };

  update = (req, res, next) => {
    const options = {
      new: true,
      runValidators: true
    };

    this.model
      .findByIdAndUpdate(req.params.id, req.body, options)
      .then(this.render(res, next))
      .catch(next);
  };

  replace = (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    const options = {
      overwrite: true,
      runValidators: true
    };

    this.model
      .update({ _id: id }, body, options)
      .exec()
      .then(result => {
        if (result.n) {
          return this.model.findById(id);
        } else {
          throw new NotFoundError("Document not found");
        }
      })
      .then(this.render(res, next))
      .catch(next);
  };

  delete = (req, res, next) => {
    const id = req.params.id;

    this.model
      .remove({ _id: id })
      .exec()
      .then((cmdResult: any) => {
        if (cmdResult.result.n) {
          res.send(204);
        } else {
          throw new NotFoundError("Document not found");
        }
        return next();
      })
      .catch(next);
  };
}
