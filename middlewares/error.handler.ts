import * as restify from "restify";
import * as log4js from "log4js";
const log = log4js.getLogger("error-handler");

export const handleError = (
  req: restify.Request,
  res: restify.Response,
  err,
  done
) => {
  log.trace("---Enter in Handle Error---");

  err.toJSON = () => {
    log.error(JSON.stringify(err.message));
    return {
      message: err.message
    };
  };

  switch (err.name) {
    case "MongoError":
      log.error(JSON.stringify(err));
      if (err.code === 1100) {
        err.statusCode = 400;
      }
      break;
    case "ValidationError":
      err.statusCode = 404;
      const messages: any[] = [];
      for (let name in err.errors) {
        messages.push({ message: err.errors[name].message });
      }
      err.toJSON = () => {
        log.error(JSON.stringify(messages));
        return {
          errors: messages
        };
      };
      break;
  }

  done();
};
