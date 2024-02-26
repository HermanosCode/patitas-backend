import Pet from 'App/Models/Pet';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import jwt from 'jsonwebtoken';



export default class PetController {
    public async postPet({ request, response }: HttpContextContract) {
      try {


      // Obtener el token JWT de la cookie en la solicitud
      const token = request.cookie('jwt_token');
      
      console.log(token.user_id)
    
      // Verificar si el token JWT es válido
      if (!token) {
        return response.status(401).json({ message: 'Token de autenticación no proporcionado' });
      }

      // Verificar y decodificar el token JWT
      const decodedToken = jwt.verify(token, process.env.JWT_TOKEN) as { user_id: string };
      console.log(decodedToken)
      const user_id = decodedToken.user_id;
      console.log(user_id)



        // Obtener los datos de la solicitud
        const petData = request.all() 

        const petPhoto = request.file('pet_photo');
  

        const nombreMascota = await Pet.findBy('pet_name',petData.pet_name)
      

        if (nombreMascota) {
          response.status(400).json({
            message : 'La mascota ya existe '})
        }else{
          const petPhotoPath = petPhoto?.tmpPath;

           await Pet.create({
              ...petData,
              pet_location : "arg",
              user_id: user_id,
              pet_photo : petPhotoPath,
              })
    
          response.status(200).json({
          message : 'La mascota fue publicada'
          });
        } 
      
        }catch (e) {
          console.log(e)
        response.status(500).json({
          message: 'Hubo un error al guardar la mascota',

      });
    }
  }
}