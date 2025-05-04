/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function(knex) {
    return knex.schema.createTable('posts', function (table) {
        table.increments('id').primary();
        table.string('type').defaultTo(null).notNullable();
        table.string('title').defaultTo(null)
        table.string('description').defaultTo(null);
        table.string('postPicture').defaultTo(null).notNullable();
        table.integer('prize').defaultTo(0);
        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.integer('category_id').unsigned().notNullable();
        table.foreign('category_id').references('id').inTable('categories').onDelete('CASCADE');
        table.timestamps(true, true); 
   });
 };
 
 /**
  * @param { import("knex").Knex } knex
  * @returns { Promise<void> }
  */
 exports.down = function(knex) {
     return knex.schema.dropTableIfExists('posts');
 };