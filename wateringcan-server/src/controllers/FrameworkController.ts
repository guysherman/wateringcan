import * as KoaRouter from 'koa-router';
import * as knex from 'knex';
import * as argon2 from 'argon2';
import * as NodeJwt from 'jsonwebtoken';

import DatabaseConnector from '../connectors/DatabaseConnector';
import FrameworkRepository, { Framework } from '../repositories/FrameworkRepository';
import { RequestContext } from './Types';

import jwt from '../middlewares/jwt';

const dbc: knex = DatabaseConnector();


const router = new KoaRouter({ prefix: '/framework' });
router.use(jwt);

router.get('/', async (ctx) => {
    const { user } = ctx.state;
    const rc = { userId: user.id };
    const fr = new FrameworkRepository(dbc, rc);

    const frameworks: Framework[] = await fr.listFrameworks();

    ctx.body = frameworks;

});

export default router;
