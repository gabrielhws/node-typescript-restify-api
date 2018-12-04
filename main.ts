import { Server } from './server/server';
import * as log4js from 'log4js';
import { Routes } from './middlewares/routes';

const server = new Server();

const log = log4js.getLogger('main');

//Mock the translate function temporary
function __(text) {
  return text;
}

const _global = global as any;
_global.__ = __;

server
  .bootstrap(Routes)
  .then((server) => {
    log.info('API Restful with Restify running: %s', server.app.address().port);
  })
  .catch((error) => {
    log.error('Server failed to start');
    log.fatal(JSON.stringify(error));
    process.exit(1);
  });
