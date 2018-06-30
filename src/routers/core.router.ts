import {Router} from '../middleware/router';
import * as restify from 'restify';

class CoreRouter extends Router {
    applyRoutes(app:restify.Server){

        app.get('/', (req, resp, next)=>{
            resp.send(200, {message:'RESTful NodeJs/TypeScript With Restify Sample running =D'});
            next();
        });
    }
}

export const coreRouter = new CoreRouter();