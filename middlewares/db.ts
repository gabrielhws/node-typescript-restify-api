import * as mongoose from "mongoose";
import * as log4js from "log4js";
import * as _ from "lodash";
import { config } from "../config/env/all";
import { rejects } from "assert";
const log = log4js.getLogger("db");

export class DB {
  private static setUri(): Promise<string> {
    return new Promise((resolve, reject) => {
      const env = _.get(process.env, "NODE_ENV", "development");
      try {
        if (
          env === "local" ||
          env === "test" ||
          env === undefined ||
          env === null
        ) {
          log.info("Local DB start - NODE_ENV: [%s]", process.env.NODE_ENV);
          resolve(
            "mongodb://" + config.database.host + "/" + config.database.database
          );
        } else {
          log.info("NODE_ENV: [%s]", process.env.NODE_ENV);
          resolve(
            "mongodb://" +
              config.database.user +
              ":" +
              config.database.password +
              "@" +
              config.database.host +
              "/" +
              config.database.database
          );
        }
      } catch (error) {
        log.error(JSON.stringify(error));
        reject(error);
      }
    });
  }

  public conn(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        DB.setUri()
          .then(function(url) {
            (<any>mongoose).Promise = global.Promise;
            mongoose.connect(url);
            const db = mongoose.connection;
            db.on("error", function(err) {
              log.error("error");
              log.fatal(JSON.stringify(err));
            });
            db.once("open", function callback() {
              log.info("Connection with database succeeded.");
            });
            db.on("disconnected", function() {
              log.info("Mongoose default connection disconnected");
            });
            process.on("SIGINT", function() {
              db.close(function() {
                log.info(
                  "Mongoose default connection disconnected through app termination"
                );
                process.exit(0);
              });
            });
            resolve();
          })
          .catch(function(err) {
            log.error("Error on Set Url");
            log.fatal(JSON.stringify(err));
            reject(err);
          });
      } catch (e) {
        log.error("Error on conn");
        log.fatal(JSON.stringify(e));
        reject(e);
      }
    });
  }
}
