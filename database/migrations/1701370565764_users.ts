import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('user_id', 255).primary()
      table.string('user_name',35).notNullable()
      table.string('user_password',100).notNullable()
      table.string('user_email',30).notNullable()

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
