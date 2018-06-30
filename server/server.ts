import {config} from '../config/env/all'
import * as restify from 'restify';
import * as mongoose from 'mongoose';
import * as log4js from 'log4js';
import {Router} from '../src/middleware/router';
const log = log4js.getLogger('server');

export class Server {

    public app:restify.Server;


    initDb(){
        return mongoose.connect(config.database.host, {

        });
    }

    initRoutes(routers): Promise<any>{
        return new Promise((resolve, reject)=>{
            try{
                this.app = restify.createServer({
                    name:'typescript-restify-api',
                    version:'1.0.0'
                });
                this.app.use(restify.plugins.queryParser());

                for (let router of routers){
                    router.applyRoutes(this.app);
                }

                this.app.listen(config.port,()=>{
                    resolve(this.app);
                });
            }catch (error) {
                log.fatal('Error in Init Routes: %s', JSON.stringify(error));
                reject(error);
            }
        });
    }

    bootstrap(routers:Router[]=[]):Promise<Server>{
        return this.initDb()
            .then(()=>
                this.initRoutes(routers).then(()=>this)
            );

    }
}