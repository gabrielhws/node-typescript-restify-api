export default {
    whitelist: [
        'http://localhost:your_port'
    ],
    database: {
        host: process.env.MONGO_URL || '127.0.0.1:27017',
        database: process.env.MONGO_DB || 'node-sample-api',
        user: process.env.MONGO_USER || '',
        password: process.env.MONGO_PASS || ''
    },
    log4js: {
        appenders: {
            app: {type: 'file', filename: 'logs/dev.app.log'},
            console: {type: 'console'}
        },
        categories: {
            default: {appenders: ['console', 'app'], level: 'trace'}
        }
    }
}