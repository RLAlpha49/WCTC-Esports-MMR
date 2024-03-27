require('dotenv').config()

const { Client } = require('pg')

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

// async function getCurrentDatabase() {
//   const res = await client.query('SELECT current_database()');
//   return res.rows[0].current_database;
// }
//
// async function getSchemas() {
//   const res = await client.query('SELECT schema_name FROM information_schema.schemata');
//   console.log('Schemas:', res.rows.map(row => row.schema_name));
// }
//
// async function getTablesInSchema(schemaName) {
//   const res = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = $1', [schemaName]);
//   console.log(`Tables in ${schemaName}:`, res.rows.map(row => row.table_name));
// }

client.connect()
// .then(() => getCurrentDatabase())
// .then(dbName => {
//   console.log(`Connected to database: ${dbName}`);
//   return getSchemas();
// })
// .then(() => getTablesInSchema('mmr'))
// .catch(err => console.error('Connection error', err.stack));

module.exports = client
