import knex, { Knex } from 'knex';
import path from 'path';

const dbClient = process.env.DB_CLIENT || 'sqlite3';

let config: Knex.Config;

if (dbClient === 'pg') {
  config = {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'bricksy',
    },
    pool: { min: 0, max: 10 },
  };
} else {
  config = {
    client: 'better-sqlite3',
    connection: {
      filename: path.resolve(__dirname, '../../../data/bricksy.db'),
    },
    useNullAsDefault: true,
    pool: { min: 0, max: 1 },
  };
}

const db = knex(config);

export default db;
