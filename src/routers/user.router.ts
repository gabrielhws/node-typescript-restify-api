import {Router} from '../middleware/router';
import * as restify from 'restify';

class UserRouter extends Router {
    applyRoutes(app:restify.Server){

        app.get('/users/me', (req, resp, next)=>{
            resp.json({message:'users router'});
            next();
        });
    }
}

export const userRouter = new UserRouter();