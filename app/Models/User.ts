import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { uuid } from 'uuidv4'

export default class User extends BaseModel {

  @column({ isPrimary: true })
  public user_id: string

  @column({})
  public user_name :string
  
  @column()
  public user_password : string

  @column()
  public user_email :string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(user: User) {
    user.user_id = uuid()
  }
}
