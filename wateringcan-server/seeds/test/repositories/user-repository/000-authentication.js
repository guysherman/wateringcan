/* eslint-disable object-curly-newline */
/* eslint-disable arrow-body-style */
exports.seed = (knex) => {
    // Deletes ALL existing entries
    return knex('user').del()
        .then(() => {
            // Inserts seed entries
            return knex('user').insert([
                { id: 1, email: 'tu1@example.com', first_name: 'Test', last_name: 'User1', hash: '$argon2i$v=19$m=4096,t=3,p=1$RVNWTmpGcjBwZlRZRDgzVQ$3g64yhCauZQWhMbys+PNvg' },
                { id: 2, email: 'tu2@example.com', first_name: 'Test', last_name: 'User2', hash: '$argon2i$v=19$m=4096,t=3,p=1$RVNWTmpGcjBwZlRZRDgzVQ$3g64yhCauZQWhMbys+PNvg' },
            ]);
        });
};
