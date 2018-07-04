import {Router} from '../middleware/router';
import * as restify from 'restify';
import {NotFoundError} from "restify-errors";
import {User} from "../models/user.model";
import * as log4js from 'log4js';
const log = log4js.getLogger('user-route');

class UserRouter extends Router {

    constructor(){
        super();
        this.on('beforeRender', document=>{
            delete document.providers.sample.password;
            delete document.providers.sample.resetPasswordToken;
            delete document.providers.sample.resetPasswordExpires;
            delete document.verified_token;
            delete document.verified_token_expires;
        });
    }

    applyRoutes(app:restify.Server){

        app.get('/users', (req, res, next)=>{
            User.find().then(this.render(res, next)).catch(next);
        });

        app.post('/users', (req, res, next)=>{
            
            let user = new User(req.body);
            
            user.save().then(this.render(res, next)).catch(next);

        });

        app.get('/users/:id', (req, res, next)=>{
            const id = req.params.id;
            User.findById(id).then(this.render(res, next)).catch(next);
        });

        app.put('/users/:id', (req, res, next)=>{
            const id = req.params.id;
            const body = req.body;
            const options = {
                overwrite:true,
                runValidators:true
            };

            User.update({_id:id}, body, options)
                .exec()
                .then(result=>{
                    if(result.n){
                        return User.findById(id);
                    }else{
                        throw new NotFoundError('User not found');
                    }
                })
                .then(this.render(res, next))
                .catch(next);
        });

        app.patch('/users/:id', (req, res, next)=>{

            const options = {
                new:true,
                runValidators:true
            };

            User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(res, next))
                .catch(next);
        });

        app.del('/users/:id', (req, res, next)=>{
            const id = req.params.id;

            User.remove({_id:id})
                .exec()
                .then((cmdResult:any)=>{
                    if(cmdResult.result.n){
                        res.send(204);
                    }else{
                        throw new NotFoundError('User not found');
                    }
                    return next();
                })
                .catch(next);
        });

    }
}

export const userRouter = new UserRouter();