const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  // Clear tables
  await knex('essays').del().catch(()=>{});
  await knex('drawings').del().catch(()=>{});
  await knex('stats').del().catch(()=>{});
  await knex('shortcuts').del().catch(()=>{});
  await knex('users').del().catch(()=>{});

  const hash = await bcrypt.hash('password', 10);
  const [userId] = await knex('users').insert({
    username: 'demo',
    email: 'demo@example.com',
    password_hash: hash
  });

  await knex('shortcuts').insert([
    { user_id: userId, title: 'MDN — JS', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
    { user_id: userId, title: 'Khan Academy', url: 'https://www.khanacademy.org' }
  ]);
};