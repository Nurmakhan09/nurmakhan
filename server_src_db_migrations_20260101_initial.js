exports.up = async function (knex) {
  await knex.schema.createTable('users', (t) => {
    t.increments('id').primary();
    t.string('username').unique().notNullable();
    t.string('email').unique().notNullable();
    t.string('password_hash').notNullable();
    t.json('settings').defaultTo(JSON.stringify({
      darkMode: false,
      zoom: 1,
      focusMode: false
    }));
    t.timestamps(true, true);
  });

  await knex.schema.createTable('shortcuts', (t) => {
    t.increments('id').primary();
    t.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    t.string('title').notNullable();
    t.string('url').notNullable();
    t.integer('order_index').defaultTo(0);
    t.timestamps(true, true);
  });

  await knex.schema.createTable('stats', (t) => {
    t.increments('id').primary();
    t.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    t.integer('session_seconds').defaultTo(0);
    t.integer('pomodoro_seconds').defaultTo(0);
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('drawings', (t) => {
    t.increments('id').primary();
    t.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    t.text('data_url'); // base64 png/svg
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('essays', (t) => {
    t.increments('id').primary();
    t.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    t.string('title');
    t.text('content');
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('essays');
  await knex.schema.dropTableIfExists('drawings');
  await knex.schema.dropTableIfExists('stats');
  await knex.schema.dropTableIfExists('shortcuts');
  await knex.schema.dropTableIfExists('users');
};