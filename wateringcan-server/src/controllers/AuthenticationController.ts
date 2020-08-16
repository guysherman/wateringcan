import * as KoaRouter from 'koa-router';
import * as argon2 from 'argon2';
import * as NodeJwt from 'jsonwebtoken';

import DatabaseConnector from '../connectors/DatabaseConnector';
import UserRepository, { UserRecord } from '../repositories/UserRepository';

const dbc = DatabaseConnector();
const users = new UserRepository(dbc);
const router = new KoaRouter({ prefix: '/auth' });

router.post('/login', async (ctx) => {
    const { email, password } : {email : string, password: string} = ctx.request.body;
    if (!(email && password)) {
        ctx.status = 400;
        ctx.message = 'Bad Request';
        ctx.body = { errorMessage: 'Bad Request, make sure you pass an email and password' };
        // eslint-disable-next-line no-useless-return
        return;
    }

    const user: UserRecord = await users.getUserWithEmail(email);

    if (!user) {
        ctx.status = 401;
        ctx.message = 'Unauthorized';
        ctx.body = { state: 'error', errorMessage: 'Unauthorized' };
        // eslint-disable-next-line no-useless-return
        return;
    }

    const passwordCorrect = await argon2.verify(user.hash, password);
    if (!passwordCorrect) {
        ctx.status = 401;
        ctx.message = 'Unauthorized';
        ctx.body = { state: 'error', errorMessage: 'Unauthorized' };
        // eslint-disable-next-line no-useless-return
        return;
    }

    const token = NodeJwt.sign({
        ...user,
        hash: undefined,
    },
    process.env.AUTH_SECRET,
    {
        expiresIn: '1 day',
    });

    ctx.body = {
        ...user,
        hash: undefined,
        token,
        state: 'success',
    };
});

router.get('/user/:userId/permittedObjects', async (ctx) => {
    const { userId } = ctx.params;

    const permittedObjects: string = await users.getPermittedObjectsForUser(userId);

    ctx.body = {
        response: { permittedObjects },
        state: 'success',
    };
})

export default router;
