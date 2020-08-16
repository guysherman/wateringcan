/* eslint-disable object-curly-newline */
/* eslint-disable arrow-body-style */
exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('permission').del();
    return await knex('user').del()
        .then(() => {
            // Inserts seed entries
            return knex('user').insert([
                { id: 1, email: 'guy@guysherman.com', first_name: 'Guy', last_name: 'Sherman', hash: '$argon2i$v=19$m=4096,t=3,p=1$RVNWTmpGcjBwZlRZRDgzVQ$3g64yhCauZQWhMbys+PNvg' },
            ]);
        });
};
