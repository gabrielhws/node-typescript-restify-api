export default {
  whitelist: ['http://seudominio.com', 'https://seudominio.com'],
  database: {
    host: process.env.MONGO_URL || '',
    database: process.env.MONGO_DB || '',
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
      app: { type: 'file', filename: 'logs/app.log' },
      console: { type: 'console' },
    },
    categories: {
      default: { appenders: ['console', 'app'], level: 'trace' },
    },
  },
};
