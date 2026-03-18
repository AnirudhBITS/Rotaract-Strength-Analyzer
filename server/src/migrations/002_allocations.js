exports.up = function (knex) {
  return knex.schema.createTable('allocations', (table) => {
    table.increments('id').primary();
    table.integer('applicant_id').unsigned().notNullable();
    table.integer('position_id').unsigned().notNullable();
    table.integer('allocated_by').unsigned().nullable();
    table.text('notes').nullable();
    table.timestamps(true, true);

    table.foreign('applicant_id').references('id').inTable('applicants').onDelete('CASCADE');
    table.foreign('allocated_by').references('id').inTable('admins').onDelete('SET NULL');
    table.unique(['applicant_id']);
    table.unique(['position_id', 'applicant_id']);
    table.index('position_id');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('allocations');
};
