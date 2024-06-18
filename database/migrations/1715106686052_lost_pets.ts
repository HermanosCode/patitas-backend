import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'lost_pets'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('pet_id').primary()
      table.uuid('user_id').primary()
      table.string('pet_name', 50).notNullable()
      table.string('pet_photo', 255).notNullable()
      table.string('pet_description', 500).notNullable()
      table.string('pet_type', 10).notNullable()
      table.string('pet_province',70).notNullable()
      table.string('pet_location', 70).notNullable()
      table.string('contact_number', 35).notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
