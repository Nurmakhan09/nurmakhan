// Run migrations programmatically for dev
const Knex = require('knex');
const config = require('./knexfile').development;

(async () => {
  const knex = Knex(config);
  console.log('Running migrations...');
  await knex.migrate.latest();
  console.log('Seeding...');
  await knex.seed.run();
  await knex.destroy();
  console.log('Done');
})();