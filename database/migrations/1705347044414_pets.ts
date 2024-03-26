import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'pets'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('pet_id',255).primary()
      table.string('user_id',255).primary()
      table.string('pet_name',40).notNullable()
      table.string('pet_photo',255).notNullable()
      table.string('pet_race',30).notNullable()
      table.string('pet_age',15).notNullable()
      table.string('pet_gender',10).notNullable()
      table.string('pet_type',10).notNullable()
      table.boolean('pet_disability').notNullable()
      table.boolean('veterinary_care').notNullable()
      table.string('pet_description',255).notNullable()
      table.string('pet_location',60).notNullable()
      table.string('pet_province',60).notNullable()
      table.string('contact_number',30).notNullable()
      
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
