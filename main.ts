import {Server} from './server/server';
import * as log4js from 'log4js';
import {Routes} from './src/middleware/routes';
const log = log4js.getLogger('main');

const server = new Server();

server.bootstrap(Routes)
    .then(server => {
        log.info('API Restful with Restify running: %s', server.app.address().port);
    })
    .catch(error => {
        log.fatal('Server failed to start');
        log.fatal(JSON.stringify(error));
        process.exit(1);
});