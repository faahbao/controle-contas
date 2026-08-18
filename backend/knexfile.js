require('dotenv').config()

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/dev.db'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './src/database/migrations'
    }
  }
}