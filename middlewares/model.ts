import { Router } from "./router";
import * as mongoose from "mongoose";
import { NotFoundError } from "restify-errors";
import * as log4js from "log4js";
const log = log4js.getLogger("model-base");

export abstract class Model<D extends mongoose.Document> extends Router {
  constructor(protected model: mongoose.Model<D>) {
    super();
  }

  protected prepareOne(
    query: mongoose.DocumentQuery<D, D>
  ): mongoose.DocumentQuery<D, D> {
    return query;
  }

  protected prepareAll(
    query: mongoose.DocumentQuery<D[], D>
  ): mongoose.DocumentQuery<D[], D> {
    return query;
  }

  validateId = (req, res, next) => {
    log.trace("Enter in ValidateId");
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      next(new NotFoundError("Document not found or Id invalid"));
    } else {
      next();
    }
  };

  findAll = (req, res, next) => {
    log.trace("Enter in FindAll");
    this.prepareAll(this.model.find())
      .then(this.renderAll(res, next))
      .catch(next);
  };

  findById = (req, res, next) => {
    log.trace("Enter in FindById");
    const id = req.params.id;

    this.prepareOne(this.model.findById(id))
      .then(this.render(res, next))
      .catch(next);
  };

  create = (req, res, next) => {
    log.trace("Enter in Create");
    let document = new this.model(req.body);

    document
      .save()
      .then(this.render(res, next))
      .catch(next);
  };

  update = (req, res, next) => {
    log.trace("Enter in Update");
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
    log.trace("Enter in Replace");
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
          return this.prepareOne(this.model.findById(id));
        } else {
          throw new NotFoundError("Document not found");
        }
      })
      .then(this.render(res, next))
      .catch(next);
  };

  delete = (req, res, next) => {
    log.trace("Enter in Delete");
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
