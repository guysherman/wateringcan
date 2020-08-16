/* eslint-disable no-console */
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import * as cors from '@koa/cors';

import './env';

import authenticationController from './controllers/AuthenticationController';

const app = new Koa();
const router = new Router();

app.use(cors({ origin: '*', credentials: true }));
app.use(bodyParser());

router.get('/', async (ctx) => {
    ctx.body = { msg: 'hello world' };
});

app.use(router.routes());
app.use(authenticationController.routes());
app.listen(3000);

console.log('Server running on port 3000');
