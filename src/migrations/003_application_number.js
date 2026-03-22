exports.up = function (knex) {
  return knex.schema.alterTable('applicants', (table) => {
    table.string('application_number', 20).nullable().unique().after('id');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('applicants', (table) => {
    table.dropColumn('application_number');
  });
};
