import Pet from 'App/Models/Pet';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {v2 as cloudinary} from 'cloudinary';
import jwt from "jsonwebtoken"

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_NAME_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export default class PetController {


  public async createPet({ request, response }: HttpContextContract) {
    try {
      // Obtener el token JWT de la cookie en la solicitud
      const token = request.cookie('pat-sin-hog');
      let user_id = '';

      if (!token) {
        return response.status(401).json({ message: 'Token JWT inválido' });
      }

      try {
        console.log(token);
        const decoded = await jwt.verify(token, process.env.JWT_TOKEN);
        console.log(decoded);

        user_id = decoded.user_id;
      } catch (error) {
        return response.status(403).json({ message: 'Error al verificar el token:' });
      }

      // Obtener los datos de la solicitud
      const petData = request.all();
      const petPhoto = request.file('pet_photo');
      const petPhotoPath = petPhoto?.tmpPath;

      const existingPet = await Pet.query().where('pet_name', petData.pet_name).where('user_id', user_id).first();

      if (existingPet) {
        return response.status(400).json({ message: 'La mascota ya existe' });
      }

      await Pet.create({
        ...petData,
        user_id: user_id,
        pet_photo: petPhotoPath,
      });

      return response.status(200).json({ message: 'La mascota fue publicada' });
    } catch (error) {
      return response.status(500).json({ message: 'Hubo un error al guardar la mascota' });
    }
  }



  public async getPets({request,response }: HttpContextContract) {
    
      const page = request.input('page', 1)
      const limit = 2
      const offset = (page - 1) * limit
  
      try {
         // Consulta para obtener las mascotas paginadas
        const mascotas = await Pet.query().offset(offset).limit(limit)
       
        // Consulta para obtener el total de mascotas
        const totalMascotas = await Pet.query().count('* as total').first()
        const numTotal = totalMascotas ? totalMascotas.$extras.total : 0;
        const totalPaginas = Math.ceil(numTotal / limit);
        
        return response.json({mascotas,totalPaginas})
      } catch (error) {
        return response.status(500).json({ error: 'Error al obtener mascotas.' })
      }
    }
  }
