import { Knex } from 'knex';

export async function runMigrations(db: Knex): Promise<void> {
  const hasTable = await db.schema.hasTable('users');
  if (hasTable) return;

  await db.schema.createTable('users', (t) => {
    t.increments('id').primary();
    t.string('name').notNullable();
    t.string('email').notNullable().unique();
    t.string('password').notNullable();
    t.string('role').notNullable().defaultTo('skilled_worker');
  });

  await db.schema.createTable('workers', (t) => {
    t.increments('id').primary();
    t.integer('user_id').notNullable().references('id').inTable('users');
    t.string('trade');
    t.integer('experience').defaultTo(0);
    t.integer('tenure').defaultTo(0);
    t.decimal('rating', 3, 2).defaultTo(0);
    t.integer('previous_projects').defaultTo(0);
    t.decimal('availability_score', 5, 2).defaultTo(0);
    t.decimal('trust_score', 5, 2).defaultTo(0);
    t.decimal('estimated_cost', 10, 2).defaultTo(0);
  });

  await db.schema.createTable('jobs', (t) => {
    t.increments('id').primary();
    t.integer('employer_id').notNullable().references('id').inTable('users');
    t.string('trade_required').notNullable();
    t.text('description').notNullable();
    t.decimal('budget', 10, 2).notNullable();
    t.string('status').notNullable().defaultTo('open');
    t.integer('worker_id').references('id').inTable('workers');
  });

  await db.schema.createTable('recommendations', (t) => {
    t.increments('id').primary();
    t.integer('job_id').notNullable().references('id').inTable('jobs');
    t.integer('worker_id').notNullable().references('id').inTable('workers');
    t.decimal('score', 8, 2).notNullable();
  });

  await db.schema.createTable('payments', (t) => {
    t.increments('id').primary();
    t.integer('job_id').notNullable().references('id').inTable('jobs');
    t.decimal('amount', 10, 2).notNullable();
    t.string('payment_status').notNullable().defaultTo('pending');
  });

  await db.schema.createTable('progress', (t) => {
    t.increments('id').primary();
    t.integer('job_id').notNullable().references('id').inTable('jobs');
    t.integer('worker_id').notNullable().references('id').inTable('workers');
    t.text('photos');
    t.text('videos');
    t.string('upload_date');
    t.boolean('approved').defaultTo(false);
  });

  await db.schema.createTable('reviews', (t) => {
    t.increments('id').primary();
    t.integer('job_id').notNullable().references('id').inTable('jobs');
    t.integer('worker_id').notNullable().references('id').inTable('workers');
    t.integer('stars').notNullable();
    t.text('review');
  });

  await db.schema.createTable('insurance', (t) => {
    t.increments('id').primary();
    t.integer('worker_id').notNullable().references('id').inTable('workers');
    t.string('insurance_status').notNullable().defaultTo('pending');
  });

  console.log('Database migrations completed successfully');
}
