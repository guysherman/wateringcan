import * as KoaRouter from 'koa-router';
import * as argon2 from 'argon2';
import * as NodeJwt from 'jsonwebtoken';

import DatabaseConnector from '../connectors/DatabaseConnector';

export interface UserRecord {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    hash: string;
}
// eslint-disable-next-line import/prefer-default-export
export class UserRepository {
    private db: any;

    constructor(db: any) {
        this.db = db;
    }

    async getUserWithEmail(email: string): Promise<UserRecord | null> {
        const [user] = await this.db('user').where({ 'user.email': email }).select({
            id: 'user.id',
            firstName: 'user.first_name',
            lastName: 'user.last_name',
            email: 'user.email',
            hash: 'user.hash',
        });

        return user;
    }
}

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

export default router;
