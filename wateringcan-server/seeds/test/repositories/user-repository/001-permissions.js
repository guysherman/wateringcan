/* eslint-disable object-curly-newline */

exports.seed = (knex) => {
    // Deletes ALL existing entries
    return knex('permission').del()
        .then(() => {
            // Inserts seed entries
            return knex('permission').insert([
                { id: 1, object: 'framework', object_id: null, user_id: 1, permission: 'create' },
                { id: 2, object: 'framework', object_id: null, user_id: 1, permission: 'read' },
                { id: 3, object: 'framework', object_id: null, user_id: 1, permission: 'write' },
                { id: 4, object: 'framework', object_id: 2, user_id: 2, permission: 'read' },
            ]);
        });
};
