exports.up = function (knex) {
  return knex.schema.createTable('application_reservations', (table) => {
    table.increments('id').primary();
    table.string('email', 255).notNullable().unique();
    table.string('application_number', 20).notNullable().unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('application_reservations');
};
