exports.up = function (knex) {
  return knex.schema
    .createTable('applicants', (table) => {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.string('email', 255).notNullable().unique();
      table.string('phone', 20).notNullable();
      table.string('secondary_phone', 20).nullable();
      table.string('club_name', 255).notNullable();
      table.string('rotary_id', 50).notNullable();
      table.integer('age').unsigned().notNullable();
      table.date('date_of_birth').notNullable();
      table.string('profession', 255).notNullable();
      table.enum('blood_group', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).notNullable();
      table.boolean('willing_to_donate').defaultTo(false);
      table.text('address').notNullable();
      table.text('past_positions').nullable();
      table.text('hobbies').nullable();
      table.string('professional_photo', 500).nullable();
      table.string('casual_photo', 500).nullable();
      table.enum('status', ['pending', 'reviewed', 'shortlisted', 'selected', 'rejected']).defaultTo('pending');
      table.text('admin_notes').nullable();
      table.timestamps(true, true);

      table.index('email');
      table.index('club_name');
      table.index('status');
    })
    .createTable('assessment_responses', (table) => {
      table.increments('id').primary();
      table.integer('applicant_id').unsigned().notNullable();
      table.integer('question_id').unsigned().notNullable();
      table.string('selected_option', 1).notNullable();
      table.timestamps(true, true);

      table.foreign('applicant_id').references('id').inTable('applicants').onDelete('CASCADE');
      table.unique(['applicant_id', 'question_id']);
    })
    .createTable('strength_scores', (table) => {
      table.increments('id').primary();
      table.integer('applicant_id').unsigned().notNullable();
      table.string('theme', 50).notNullable();
      table.integer('score').unsigned().defaultTo(0);
      table.integer('rank').unsigned().nullable();
      table.timestamps(true, true);

      table.foreign('applicant_id').references('id').inTable('applicants').onDelete('CASCADE');
      table.unique(['applicant_id', 'theme']);
      table.index('score');
    })
    .createTable('role_preferences', (table) => {
      table.increments('id').primary();
      table.integer('applicant_id').unsigned().notNullable();
      table.integer('position_id').unsigned().notNullable();
      table.integer('preference_order').unsigned().notNullable();
      table.enum('type', ['user_choice', 'system_suggestion']).notNullable();
      table.timestamps(true, true);

      table.foreign('applicant_id').references('id').inTable('applicants').onDelete('CASCADE');
      table.unique(['applicant_id', 'position_id', 'type']);
    })
    .createTable('admins', (table) => {
      table.increments('id').primary();
      table.string('username', 100).notNullable().unique();
      table.string('password', 255).notNullable();
      table.string('name', 255).notNullable();
      table.enum('role', ['super_admin', 'admin', 'viewer']).defaultTo('viewer');
      table.timestamps(true, true);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('role_preferences')
    .dropTableIfExists('strength_scores')
    .dropTableIfExists('assessment_responses')
    .dropTableIfExists('admins')
    .dropTableIfExists('applicants');
};
