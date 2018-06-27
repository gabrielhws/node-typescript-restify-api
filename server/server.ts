import config from '../config/env/all';
import * as restify from 'restify';
import * as log4js from 'log4js';
const log = log4js.getLogger('server-ts');

export class Server {

    public application:restify.Server;

    initRoutes(): Promise<any>{
        return new Promise((resolve, reject)=>{
            try{
                this.application = restify.createServer({
                    name:'typescript-restify-api',
                    version:'1.0.0'
                });
                this.application.use(restify.plugins.queryParser());

                this.application.get('/', (req, resp, next)=>{
                    resp.send(200, {message:'RESTful NodeJs/TypeScript With Restify Sample running =D'});
                    next();
                });

                this.application.listen(config.port,()=>{
                    resolve(this.application);
                });
            }catch (error) {
                reject(error);
            }
        });
    }

    bootstrap():Promise<Server>{
        return this.initRoutes().then(()=>this)
    }
}