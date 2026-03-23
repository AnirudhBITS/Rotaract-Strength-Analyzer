exports.up = function (knex) {
  return knex.schema.createTable('finalised_officials', (table) => {
    table.increments('id').primary();
    table.integer('applicant_id').unsigned().notNullable();
    table.integer('position_id').unsigned().notNullable();
    table.string('position_title', 255).notNullable();
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable();
    table.string('phone', 20).notNullable();
    table.string('club_name', 255).notNullable();
    table.string('rotary_id', 50).notNullable();
    table.integer('age').unsigned().notNullable();
    table.date('date_of_birth').notNullable();
    table.string('profession', 255).notNullable();
    table.enum('blood_group', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).notNullable();
    table.boolean('willing_to_donate').defaultTo(false);
    table.text('address').notNullable();
    table.specificType('professional_photo', 'LONGTEXT').nullable();
    table.specificType('casual_photo', 'LONGTEXT').nullable();
    table.integer('confirmed_by').unsigned().nullable();
    table.timestamp('confirmed_at').nullable();
    table.timestamps(true, true);

    table.foreign('applicant_id').references('id').inTable('applicants').onDelete('CASCADE');
    table.foreign('confirmed_by').references('id').inTable('admins').onDelete('SET NULL');
    table.unique(['applicant_id']);
    table.index('position_id');
    table.index('blood_group');
    table.index('willing_to_donate');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('finalised_officials');
};
