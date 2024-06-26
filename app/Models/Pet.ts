import { BaseModel, beforeCreate, column } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';

export default class Pet extends BaseModel {


    @column({ isPrimary: true })
    public pet_id: string


    @column({isPrimary : true})
    public user_id : string

    @column({})
    public pet_location: string

    @column({})
    public contact_number: string

    @column({})
    public pet_name: string

    @column()
    public pet_photo : string
  
    @column({})
    public pet_race : string

    @column({})
    public pet_age : string

    @column({})
    public pet_gender : string 

    @column({})
    public pet_type : string

    @column({})
    public pet_disability : boolean

    @column({})
    public veterinary_care : boolean

    @column({})
    public pet_description : string 

    @column({})
    public pet_province : string

    @column({})
    public adopted_at : DateTime


    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @beforeCreate()
    public static async assignUuid(pet: Pet) {
        pet.pet_id = uuid()
    }
}