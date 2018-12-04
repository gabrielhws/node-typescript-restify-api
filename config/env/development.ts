export default {
  whitelist: [
    'http://localhost:9001',
    'http://localhost:9001',
    'http://dev.seu_dominio.com',
    'https://dev.seu_dominio.com',
  ],
  database: {
    host: process.env.MONGO_URL || 'localhost:27017',
    database: process.env.MONGO_DB || 'node-sample-api',
    port: process.env.MONGO_PORT || 27017,
    user: process.env.MONGO_USER || '',
    password: process.env.MONGO_PASS || '',
  },
  mail_default: process.env.MAIL_DEFAULT || 'mandrill', //[mandrill, sendgrid]
  mandrill: {
    key: process.env.MANDRILL_KEY || '',
    from: process.env.MANDRILL_FROM || '',
    from_name: process.env.MANDRILL_FROM_NAME || '',
    to: process.env.MANDRILL_TO || '',
    shipping: process.env.MANDRILL_TO || '',
  },
  sendgrid: {
    api_key: process.env.SENDGRID_API_KEY || '',
    from: process.env.SENDGRID_FROM || '',
    from_name: process.env.SENDGRID_FROM_NAME || '',
    to: process.env.SENDGRID_TO || '',
  },
  log4js: {
    appenders: {
      app: { type: 'file', filename: 'logs/dev.app.log' },
      console: { type: 'console' },
    },
    categories: {
      default: { appenders: ['console', 'app'], level: 'trace' },
    },
  },
};
