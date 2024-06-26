import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid';
import bcryptjs from 'bcryptjs';



export default class User extends BaseModel {

  @column({ isPrimary: true })
  public user_id: string

  @column({})
  public user_name: string

  @column()
  public user_password: string

  @column()
  public user_photo : string

  @column()
  public user_email: string
  
  @column()
  public contact_number : string
  
  @column()
  public favorites_pets : string[]

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async assignUuid(user: User) {
    user.user_id = uuid()

  }

  @beforeCreate()
  public static async hashPassword(user: User) {
    user.user_password = await bcryptjs.hash(user.user_password, 8)

  }
}
