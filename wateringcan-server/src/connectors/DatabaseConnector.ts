import * as knex from 'knex';

const DatabaseConnector = (): knex => {
    console.log(`PG_HOST: ${process.env.PG_HOST}`);
    return knex({
        client: 'pg',
        connection: {
            host: process.env.PG_HOST,
            user: process.env.PG_USER,
            password: process.env.PG_PASS,
            database: process.env.PG_DATABASE,
        },
    });
};

export default DatabaseConnector;
