"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    port: process.env.PORT || 5001,
    domain: process.env.DOMAIN_REST || 'https://your_domain.com',
    domain_2: process.env.DOMAIN_REST || 'https://your_domain.com',
    title: 'NodeJs/TypeScript Sample Restify-API',
    email: 'your_email@domain.com',
    token_secret: process.env.TOKEN_SECRET || 'sample',
    header_secret: process.env.HEADER_SECRET || 'sample',
};
