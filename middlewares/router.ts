import * as restify from "restify";
import { EventEmitter } from "events";
import { NotFoundError } from "restify-errors";
import * as log4js from "log4js";
const log = log4js.getLogger("router-base");

export abstract class Router extends EventEmitter {
  abstract applyRoutes(app: restify.Server);

  envelope(document: any): any {
    log.trace("Enter in Envelope");
    return document;
  }

  envelopeAll(documents: any[], options: any = {}): any {
    log.trace("Enter in EnvelopeAll");
    return documents;
  }

  render(response: restify.Response, next: restify.Next) {
    log.trace("Enter in Render");
    return document => {
      if (document) {
        this.emit("beforeRender", document);
        response.json(this.envelope(document));
      } else {
        throw new NotFoundError("Document not found");
      }
      return next();
    };
  }

  renderAll(response: restify.Response, next: restify.Next, options: any = {}) {
    log.trace("Enter in RenderAll");
    return (documents: any[]) => {
      if (documents) {
        documents.forEach((document, index, array) => {
          this.emit("beforeRender", document);
          array[index] = this.envelope(document);
        });
        response.json(this.envelopeAll(documents, options));
      } else {
        response.json(this.envelopeAll([]));
      }
      return next();
    };
  }
}
