import * as mongoose from 'mongoose';
import * as log4js from 'log4js';
import * as _ from 'lodash';
import config from '../config/config';
import { rejects } from 'assert';
const log = log4js.getLogger('db');

export class DB {
  private static setUri(): Promise<string> {
    return new Promise((resolve, reject) => {
      const env = _.get(process.env, 'NODE_ENV', 'development');
      try {
        if (
          env === 'local' ||
          env === 'test' ||
          env === undefined ||
          env === null
        ) {
          log.info('Local DB start - NODE_ENV: [%s]', process.env.NODE_ENV);
          resolve(
            'mongodb://' + config.database.host + '/' + config.database.database
          );
        } else {
          log.info('NODE_ENV: [%s]', process.env.NODE_ENV);
          resolve(
            'mongodb://' +
              config.database.user +
              ':' +
              config.database.password +
              '@' +
              config.database.host +
              '/' +
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
            const options = {
              autoIndex: false, // Don't build indexes
              reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
              reconnectInterval: 500, // Reconnect every 500ms
              poolSize: 10, // Maintain up to 10 socket connections
              // If not connected, return errors immediately rather than waiting for reconnect
              bufferMaxEntries: 0,
              connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
              socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
              family: 4, // Use IPv4, skip trying IPv6
            };
            mongoose
              .connect(
                url,
                options
              )
              .then(() => {
                const db = mongoose.connection;
                db.on('error', function(err) {
                  log.error('error');
                  log.fatal(JSON.stringify(err));
                });
                db.once('open', function callback() {
                  log.info('Connection with database succeeded.');
                });
                db.on('disconnected', function() {
                  log.info('Mongoose default connection disconnected');
                });
                process.on('SIGINT', function() {
                  db.close(function() {
                    log.info(
                      'Mongoose default connection disconnected through app termination'
                    );
                    process.exit(0);
                  });
                });
                resolve();
              })
              .catch((error) => {
                log.error('Mongoose connect fail!');
                log.error(JSON.stringify(error));
                reject(error);
              });
          })
          .catch(function(err) {
            log.error('Error on Set Url');
            log.fatal(JSON.stringify(err));
            reject(err);
          });
      } catch (e) {
        log.error('Error on conn');
        log.fatal(JSON.stringify(e));
        reject(e);
      }
    });
  }
}
