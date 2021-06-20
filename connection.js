const Pg = require('pg')

const pool = new Pg.Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'authenticate',
  password: 'password',
  port: 5432,
});

exports.pool = pool;
