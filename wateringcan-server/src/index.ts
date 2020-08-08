/* eslint-disable no-console */
import * as dotenv from 'dotenv';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';

dotenv.config();

const app = new Koa();
const router = new Router();

app.use(bodyParser());

router.get('/', async (ctx) => {
    ctx.body = { msg: 'hello world' };
});

app.use(router.routes());
app.listen(3000);

console.log('Server running on port 3000');
