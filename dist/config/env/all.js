"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    port: process.env.SERVER_PORT || 3000,
    domain: process.env.DOMAIN_REST || 'https://your_domain.com',
    domain_2: process.env.DOMAIN_REST || 'https://your_domain.com',
    title: 'NodeJs/TypeScript Sample Restify-API',
    email: 'your_email@domain.com',
    token_secret: process.env.TOKEN_SECRET || 'sample',
    header_secret: process.env.HEADER_SECRET || 'sample',
    database: {
        host: process.env.MONGO_URL || 'localhost:27017',
        database: process.env.MONGO_DB || 'node-sample-api',
        port: process.env.MONGO_PORT || 27017,
        user: process.env.MONGO_USER || '',
        password: process.env.MONGO_PASS || ''
    }
};
