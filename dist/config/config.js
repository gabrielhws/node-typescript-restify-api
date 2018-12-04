"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log4js = require("log4js");
const glob = require("glob");
const lodash_1 = require("lodash");
const log = log4js.getLogger('config');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.LANG_ENV = process.env.LANG_ENV || 'pt_BR';
class Config {
    constructor() {
        this.init = () => {
            if (process.env.LANG_ENV) {
                log.info('Configuration file found for "' +
                    process.env.LANG_ENV +
                    '" environment');
            }
            else {
                log.warn('LANG_ENV is not defined! Using default language: %s', process.env.LANG_ENV);
            }
            const environmentFiles = glob.sync('./config/env/' + process.env.NODE_ENV + '.ts');
            if (!environmentFiles.length) {
                log.error('No configuration file found for "' +
                    process.env.NODE_ENV +
                    '" environment using development instead');
            }
            else {
                log.warn('NODE_ENV is not defined! Using default development environment');
                process.env.NODE_ENV = 'development';
            }
        };
        this.init();
    }
    getGlobbedFiles(globPatterns, excludes) {
        const _this = this;
        let urlRegex = new RegExp('^(?:[a-z]+:)?//', 'i');
        let output = [];
        // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
        if (lodash_1.isArray(globPatterns)) {
            globPatterns.forEach((globPattern) => {
                output = lodash_1.union(output, _this.getGlobbedFiles(globPattern, excludes));
            });
        }
        else if (lodash_1.isString(globPatterns)) {
            if (urlRegex.test(globPatterns)) {
                output.push(globPatterns);
            }
            else {
                let files = glob.sync(globPatterns);
                if (excludes) {
                    files = files.map(function (file) {
                        if (lodash_1.isArray(excludes)) {
                            for (let i in excludes) {
                                if (excludes.hasOwnProperty(i)) {
                                    file = file.replace(excludes[i], '');
                                }
                            }
                        }
                        else {
                            file = file.replace(excludes, '');
                        }
                        return file;
                    });
                }
                output = lodash_1.union(output, files);
            }
        }
        return output;
    }
}
exports.Config = Config;
const setup = () => {
    new Config();
    let all = require('./env/all');
    let env = require(`./env/${process.env.NODE_ENV}`);
    return Object.assign({}, all.default, env.default);
};
exports.default = setup();
