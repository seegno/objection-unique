#!/usr/bin/env node

/**
 * Module dependencies.
 */

import knex from '../utils/knex';

/**
 * Exit process.
 */

const exit = process.exit;

/**
 * Initialize database.
 */

(async () => {
  // Drop `Test` table.
  await knex.schema.dropTableIfExists('Test');

  // Create `Test` table.
  await knex.schema
   .createTableIfNotExists('Test', table => {
     table.increments('id').primary();
     table.string('foo').unique();
     table.string('bar').unique();
     table.string('biz');
   });

  exit();
})();
