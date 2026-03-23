exports.up = function (knex) {
  return knex.schema.alterTable('applicants', (table) => {
    table.specificType('professional_photo', 'LONGTEXT').nullable().alter();
    table.specificType('casual_photo', 'LONGTEXT').nullable().alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('applicants', (table) => {
    table.string('professional_photo', 500).nullable().alter();
    table.string('casual_photo', 500).nullable().alter();
  });
};
