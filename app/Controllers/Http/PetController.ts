import Pet from 'App/Models/Pet';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {v2 as cloudinary} from 'cloudinary';


cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_NAME_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export default class PetController {
  public async postPet({ request, response }: HttpContextContract) {
    
    try {
      // Obtener los datos de la solicitud
      const petData = request.all();
      const petPhoto = request.file('pet_photo');
      const nombreMascota = await Pet.findBy('pet_name', petData.pet_name);

      if (nombreMascota) {
        return response.status(400).json({
          message: 'La mascota ya existe ',
        });
      } else {
        if (!petPhoto) {
          return response.status(400).json({
            message: 'No se proporcionó ninguna imagen',
          });
        }
        
        const uploadedPhoto = await cloudinary.uploader.upload(petPhoto.tmpPath!, {
          upload_preset: 'patSinHog'
         
        });
        

        const imageUrl = uploadedPhoto.secure_url;

        // Guarda la URL de la imagen en la base de datos
        await Pet.create({
          ...petData,
          user_id: 'tomas',
          pet_photo: imageUrl,
        });

        return response.status(200).json({
          message: 'La mascota fue publicada',
          imageUrl: imageUrl, 
        });
      }
    } catch (e) {
      console.log(e);
      return response.status(500).json({
        message: 'Hubo un error al guardar la mascota',
      });
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