exports.up = async function (knex) {
  await knex.schema.createTable('application_counters', (table) => {
    table.integer('year').primary();
    table.integer('next_seq').unsigned().notNullable().defaultTo(1);
  });

  // Initialize counter from existing application numbers
  const [[{ maxNum }]] = await knex.raw(
    "SELECT COALESCE(MAX(CAST(SUBSTRING_INDEX(application_number, '-', -1) AS UNSIGNED)), 0) as maxNum FROM applicants WHERE application_number LIKE 'RSA-%'"
  );

  if (maxNum > 0) {
    const year = new Date().getFullYear();
    await knex('application_counters').insert({ year, next_seq: maxNum + 1 });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('application_counters');
};
