/* eslint-disable arrow-body-style */
exports.up = async (knex) => {
    let result = await knex.schema.createTable('framework', (table) => {
        table.increments('id');
        table.text('name').notNullable();
    });

    result = await knex.schema.createTable('section', (table) => {
        table.increments('id');
        table.integer('framework_id');
        table.text('name').notNullable();
        table.text('description').notNullable();

        table.foreign('framework_id').references('framework.id');
    });

    result = await knex.schema.createTable('capability', (table) => {
        table.increments('id');
        table.integer('section_id');
        table.text('name').notNullable();
        table.text('description').notNullable();

        table.foreign('section_id').references('section.id');
    });

    result = await knex.schema.createTable('behavior', (table) => {
        table.increments('id');
        table.integer('capability_id');
        table.text('name').notNullable();
        table.text('description').notNullable();
        table.integer('level');

        table.foreign('capability_id').references('capability.id');
    });
    return result;
};

exports.down = async (knex) => {
    let result = await knex.schema.dropTable('behavior');
    result = await knex.schema.dropTable('capability');
    result = await knex.schema.dropTable('section');
    result = await knex.schema.dropTable('framework');
    return result;
};
