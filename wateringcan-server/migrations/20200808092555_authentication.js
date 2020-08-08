/* eslint-disable arrow-body-style */
exports.up = (knex) => {
    return knex.schema.createTable('user', (table) => {
        table.increments('id');
        table.text('first_name').notNullable();
        table.text('last_name').notNullable();
        table.text('username').notNullable().unique();
        table.text('hash').notNullable();
    });
};

exports.down = (knex) => {
    return knex.schema.dropTable('user');
};
