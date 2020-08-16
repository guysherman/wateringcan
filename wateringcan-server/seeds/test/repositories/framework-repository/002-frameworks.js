/* eslint-disable object-curly-newline */

exports.seed = (knex) => {
    // Deletes ALL existing entries
    return knex('framework').del()
        .then(() => {
            // Inserts seed entries
            return knex('framework').insert([
                { id: 1, name: 'Test Framework - Seed 1' },
                { id: 2, name: 'Test Framework - Seed 2' },
            ]);
        });
};
