import * as KoaJwt from 'koa-jwt';

const jwt = KoaJwt({ secret: process.env.AUTH_SECRET });

export default jwt;