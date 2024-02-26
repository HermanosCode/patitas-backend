import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'pets'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('pet_id',255).primary()
      table.string('user_id',255).primary()
      table.string('pet_name',255).notNullable()
      table.string('pet_photo',255).notNullable()
      table.string('pet_race',255).notNullable()
      table.string('pet_age',255).notNullable()
      table.string('pet_gender',255).notNullable()
      table.string('pet_type',255).notNullable()
      table.boolean('pet_disability').notNullable()
      table.boolean('veterinary_care').notNullable()
      table.string('pet_description',255).notNullable()
      table.string('pet_location',255).notNullable()
      table.string('contact_number',255).notNullable()
      
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
