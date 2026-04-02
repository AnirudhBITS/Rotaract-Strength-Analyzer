exports.up = function (knex) {
  return knex.schema.createTable('scheduled_meetings', (table) => {
    table.increments('id').primary();
    table.integer('applicant_id').unsigned().notNullable();
    table.integer('position_id').unsigned().nullable();
    table.string('date', 50).notNullable();
    table.string('time', 50).notNullable();
    table.text('meet_link').notNullable();
    table.integer('scheduled_by').unsigned().nullable();
    table.timestamps(true, true);

    table.foreign('applicant_id').references('id').inTable('applicants').onDelete('CASCADE');
    table.foreign('scheduled_by').references('id').inTable('admins').onDelete('SET NULL');
    table.index('applicant_id');
    table.index('position_id');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('scheduled_meetings');
};
