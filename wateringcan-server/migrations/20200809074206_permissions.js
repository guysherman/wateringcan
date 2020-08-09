exports.up = (knex) => {
    return knex.schema.createTable('permission', (table) => {
        table.increments('id');
        table.text('object').notNullable();
        table.integer('object_id');
        table.integer('user_id').notNullable();
        table.text('permission');

        table.foreign('user_id').references('user.id');
    });
};

exports.down = (knex) => {
    return knex.schema.dropTable('permission');
};
