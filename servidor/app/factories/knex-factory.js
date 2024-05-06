const knexConstructor = require('knex');

const knex = knexConstructor({
    client: 'pg',
    pool: {
        min: 0,
        max: 5,
        idleTimeoutMillis: 10000,
    },
    connection: {
        host: 'localhost',
        port: 5432,
        user: 'root',
        password: '123456',
        database: 'smart-data',
    },
});


module.exports = knex;