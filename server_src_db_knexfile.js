const path = require('path');
require('dotenv').config();

const dbFile = process.env.DATABASE_URL || path.resolve(__dirname, '../../data/livingbook.db');

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: dbFile
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, './migrations')
    },
    seeds: {
      directory: path.resolve(__dirname, './seeds')
    },
    pool: {
      afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb)
    }
  }
};