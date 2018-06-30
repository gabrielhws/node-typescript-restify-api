import * as log4js from 'log4js';
import * as glob from 'glob';
import * as _ from 'lodash';

const log = log4js.getLogger('config');

export class Config {

    constructor() {
        this.init();
    }

    init(){
        const environmentFiles = glob.sync('./config/env/' + process.env.NODE_ENV + '.ts');
        if(!environmentFiles.length){
            log.error('No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead');
        }else{
            log.warn('NODE_ENV is not defined! Using default development environment');
        }
        process.env.NODE_ENV = 'development';
    }


    getGlobbedFiles(globPatterns, excludes){
        const _this = this;
        let urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');
        let output = [];
        // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
        if (_.isArray(globPatterns)) {
            globPatterns.forEach(function (globPattern) {
                output = _.union(output, _this.getGlobbedFiles(globPattern, excludes));
            });
        } else if (_.isString(globPatterns)) {
            if (urlRegex.test(globPatterns)) {
                output.push(globPatterns);
            } else {
                let files = glob.sync(globPatterns);
                if (excludes) {
                    files = files.map(function (file) {
                        if (_.isArray(excludes)) {
                            for (let i in excludes) {
                                if (excludes.hasOwnProperty(i)) {
                                    file = file.replace(excludes[i], '');
                                }
                            }
                        } else {
                            file = file.replace(excludes, '');
                        }
                        return file;
                    });
                }
                output = _.union(output, files);
            }
        }
        return output;
    }
}
