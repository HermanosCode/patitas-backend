import Pet from 'App/Models/Pet';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import jwt from 'jsonwebtoken';



export default class PetController {
  public async createPet({ request, response }: HttpContextContract) {
    try {


      // Obtener el token JWT de la cookie en la solicitud
      const token = request.cookie('pat-sin-hog'); //REVIEW


      // Verificar si el token JWT es válido
      if (!token) {
        return response.status(401).json({ message: 'Token de autenticación no proporcionado' });
      }

      // Verificar y decodificar el token JWT
      const decodedToken = jwt.verify(token, process.env.JWT_TOKEN) as { user_id: string };
      const user_id = decodedToken.user_id;



      // Obtener los datos de la solicitud
      const petData = request.all()

      const petPhoto = request.file('pet_photo');


      const mascota = await Pet.findBy('pet_id', petData.pet_id) //Buscar por el ID de la mascota 


      if (mascota) {
        response.status(400).json({
          message: 'La mascota ya existe '
        })
      } else {
        const petPhotoPath = petPhoto?.tmpPath;

        await Pet.create({
          ...petData,
          user_id: user_id,
          pet_photo: petPhotoPath,
        })

        response.status(200).json({
          message: 'La mascota fue publicada'
        });
      }

    } catch (e) {
      response.status(500).json({
        message: 'Hubo un error al guardar la mascota',

      });
    }
  }
}