const Process = process;

export default {
  port: Process.env.SERVER_PORT || 3000,
  domain: Process.env.DOMAIN_REST || 'https://your_domain.com',
  domain_2: Process.env.DOMAIN_REST || 'https://your_domain.com',
  title: 'NodeJs/TypeScript Sample Restify-API',
  email: 'your_email@domain.com',
  token_secret: Process.env.TOKEN_SECRET || 'sample',
  header_secret: Process.env.HEADER_SECRET || 'sample',
  database: {
    host: Process.env.MONGO_URL || 'localhost:27017',
    database: Process.env.MONGO_DB || 'node-sample-api',
    port: Process.env.MONGO_PORT || 27017,
    user: Process.env.MONGO_USER || '',
    password: Process.env.MONGO_PASS || '',
  },
  security: {
    saltRounds: Process.env.SALT_ROUNDS || 10,
  },
};
