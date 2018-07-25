///<reference path="../node_modules/@types/mongoose/index.d.ts"/>
import { Router } from "./router";
import * as mongoose from "mongoose";
import { NotFoundError } from "restify-errors";
import * as log4js from "log4js";
const log = log4js.getLogger("model-base");

export abstract class Model<D extends mongoose.Document> extends Router {
  basePath: string;

  pageSize: number = 6;

  constructor(protected model: mongoose.Model<D>) {
    super();
    this.basePath = `/${model.collection.name}`;
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

  envelope(document: any): any {
    log.trace("Enter in Envelope");
    let resource = Object.assign({ _links: {} }, document.toJSON());
    resource._links.self = `${this.basePath}/${resource._id}`;
    return resource;
  }

  envelopeAll(documents: any[], options: any = {}): any {
    log.trace("Enter in EnvelopeAll");
    const resource: any = {
      _links: {
        self: `${options.url}`
      },
      _options: {
        page: options.page,
        pageSize: options.pageSize,
        totalItems: options.count
      },
      items: documents
    };
    if (options.page && options.count && options.pageSize) {
      if (options.page > 1) {
        resource._links.previous = `${this.basePath}?_page=${options.page - 1}`;
      }
      const remaining = options.count - options.page * options.pageSize;
      if (remaining > 0) {
        resource._links.next = `${this.basePath}?_page=${options.page + 1}`;
      }
    }
    return resource;
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
    let page = parseInt(req.query._page || 1);
    page = page > 0 ? page : 1;
    const skip = (page - 1) * this.pageSize;

    this.model
      .count({})
      .exec()
      .then(count =>
        this.prepareAll(
          this.model
            .find()
            .skip(skip)
            .limit(this.pageSize)
        )
          .then(
            this.renderAll(res, next, {
              page,
              count,
              pageSize: this.pageSize,
              url: req.url
            })
          )
          .catch(next)
      )
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
