/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
import { assert } from 'chai';
import * as knex from 'knex';

import '../../src/env';

import FrameworkRepository, { Framework } from '../../src/repositories/FrameworkRepository';
import { RequestContext } from '../../src/controllers/Types';

const DatabaseConnector = (): knex => {
    return knex({
        client: 'pg',
        connection: {
            host: process.env.PG_HOST,
            user: process.env.PG_USER,
            password: process.env.PG_PASS,
            database: 'unittest',
        },
        seeds: {
            directory: './seeds/test/repositories/framework-repository',
        },
    });
};

let db: knex | null = null;

suite('FrameworkRepository', () => {
    suiteSetup(() => {
        db = DatabaseConnector();
    });

    setup(async () => {
        await db?.migrate.latest();
    });

    suite('#createFramework()', () => {
        setup(async () => {
            await db?.seed.run();
        });

        test('returns a Framework object', async () => {
            const rc: RequestContext = { userId: 1 };
            const fr = new FrameworkRepository(db, rc);

            const frameworkName = 'Test Framework';
            const f: Framework = await fr.createFramework(frameworkName);

            assert.isDefined(f, 'f was undefined');
            assert.isNotNull(f, 'f was null');
            assert.equal(f.name, frameworkName, 'f.name was incorrect');
            assert.isDefined(f.id, 'f.id was not defined');
            assert.isNotNull(f.id, 'f.id was null');
        });

        test('adds the framework to the db', async() => {
            const rc: RequestContext = { userId: 1 };
            const fr = new FrameworkRepository(db, rc);

            const frameworkName = 'Test Framework - createFramework adds to db';
            const f: Framework = await fr.createFramework(frameworkName);

            const result = await db('framework').where({ 'framework.name': frameworkName });
            assert.equal(result.length, 1, 'too many records');
            assert.equal(result[0].id, f.id, 'id not matching what was in db');
        });
    });

    suite('#listFrameworks', () => {
        setup(async () => {
            await db.seed.run();
        });

        test('returns correct number of frameworks for user 1', async () => {
            const rc: RequestContext = { userId: 1 };
            const fr = new FrameworkRepository(db, rc);
            const fs: Framework[] = await fr.listFrameworks();

            assert.equal(fs.length, 2, 'incorrect number of frameworks returned');
        });

        test('returns correct number of frameworks for user 2', async () => {
            const rc: RequestContext = { userId: 2 };
            const fr = new FrameworkRepository(db, rc);
            const fs: Framework[] = await fr.listFrameworks();

            assert.equal(fs.length, 1, 'incorrect number of frameworks returned');
        });
    });

    suiteTeardown(() => {
        db.destroy();
    });
});
