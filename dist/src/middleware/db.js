"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const log4js = require("log4js");
const _ = require("lodash");
const all_1 = require("../../config/env/all");
const log = log4js.getLogger("db");
class DB {
  static setUri() {
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
            "mongodb://" +
              all_1.config.database.host +
              "/" +
              all_1.config.database.database
          );
        } else {
          log.info("NODE_ENV: [%s]", process.env.NODE_ENV);
          resolve(
            "mongodb://" +
              all_1.config.database.user +
              ":" +
              all_1.config.database.password +
              "@" +
              all_1.config.database.host +
              "/" +
              all_1.config.database.database
          );
        }
      } catch (error) {
        log.error(JSON.stringify(error));
        reject(error);
      }
    });
  }
  conn() {
    return new Promise((resolve, reject) => {
      try {
        DB.setUri()
          .then(function(url) {
            mongoose.Promise = global.Promise;
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
exports.DB = DB;
