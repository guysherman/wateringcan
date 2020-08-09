import { assert } from 'chai';
import * as knex from 'knex';

import UserRepository, { UserRecord } from '../../src/repositories/UserRepository';

const DatabaseConnector = () => {
    return knex({
        client: 'sqlite3',
        connection: {
            filename: './mydb.sqlite',
        },
    });
};

const db = DatabaseConnector();

suite('UserRepository', () => {
    setup(async () => {
        await db.migrate.latest();
    });

    suite('#getUserWithEmail()', () => {
        test('returns a user with correct details', async () => {
            await db.seed.run();

            const ur = new UserRepository(db);
            const user: UserRecord = await ur.getUserWithEmail('guy@guysherman.com');

            assert.isNotNull(user, 'User was null');
            assert.equal(user.id, 1, 'User id was wrong');
            assert.equal(user.firstName, 'Guy', 'firstName was wrong');
            assert.equal(user.lastName, 'Sherman', 'lastName was wrong');
        });
    });

    suite('#getPermittedObjectsForUser()', () => {
        test('returns only one word when all permissions are for same object', async () => {
            await db.seed.run();

            const ur = new UserRepository(db);
            const permittedObjects: string = await ur.getPermittedObjectsForUser(1);

            assert.isNotNull(permittedObjects, 'string was null');
            assert.equal('framework', permittedObjects, 'string was incorrect');
        });
    });
});
