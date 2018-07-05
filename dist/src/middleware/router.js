"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const restify_errors_1 = require("restify-errors");
class Router extends events_1.EventEmitter {
  render(response, next) {
    return document => {
      if (document) {
        this.emit("beforeRender", document);
        response.json(document);
      } else {
        throw new restify_errors_1.NotFoundError("Document not found");
      }
      return next();
    };
  }
}
exports.Router = Router;
