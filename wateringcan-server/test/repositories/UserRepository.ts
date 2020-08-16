import { assert } from 'chai';
import * as knex from 'knex';

import UserRepository, { UserRecord } from '../../src/repositories/UserRepository';

const DatabaseConnector = (): knex => {
    return knex({
        client: 'sqlite3',
        connection: {
            filename: './mydb.sqlite',
        },
        seeds: {
            directory: './seeds/test/repositories/user-repository',
        },
    });
};

let db: knex | null = null;

suite('UserRepository', () => {
    suiteSetup(() => {
        db = DatabaseConnector();
    });

    setup(async () => {
        await db?.migrate.latest();
    });

    suite('#getUserWithEmail()', () => {
        test('returns a user with correct details', async () => {
            await db?.seed.run();

            const ur = new UserRepository(db);
            const user: UserRecord = await ur.getUserWithEmail('tu1@example.com');

            assert.isNotNull(user, 'User was null');
            assert.equal(user.id, 1, 'User id was wrong');
            assert.equal(user.firstName, 'Test', 'firstName was wrong');
            assert.equal(user.lastName, 'User1', 'lastName was wrong');
        });

        test('returns undefined for a user that doesn\'t exist', async () => {
            await db?.seed.run();

            const ur = new UserRepository(db);
            const user: UserRecord = await ur.getUserWithEmail('non-exist@example.com');

            assert.isUndefined(user, 'User was not null');
        });
    });

    suite('#getPermittedObjectsForUser()', () => {
        test('returns only one word when all permissions are for same object', async () => {
            await db?.seed.run();

            const ur = new UserRepository(db);
            const permittedObjects: string = await ur.getPermittedObjectsForUser(1);

            assert.isNotNull(permittedObjects, 'string was null');
            assert.equal('framework', permittedObjects, 'string was incorrect');
        });

        test('returns empty string when user has no permissions', async () => {
            await db?.seed.run();

            const ur = new UserRepository(db);
            const permittedObjects: string = await ur.getPermittedObjectsForUser(2);

            assert.isNotNull(permittedObjects, 'string was null');
            assert.equal('', permittedObjects, 'string was incorrect');
        });
    });

    suiteTeardown(() => {
        db?.destroy();
    });
});
