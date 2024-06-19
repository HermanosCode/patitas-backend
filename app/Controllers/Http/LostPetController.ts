import LostPet from "App/Models/LostPet"
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import jwt from "jsonwebtoken"
import { v2 as cloudinary } from 'cloudinary';
import { cantidadMascotasAMostrar } from '../../../common/constants';


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_NAME_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export default class LostPetController {

  public async createLostPet({ request, response }: HttpContextContract) {
    try {

      const token = request.cookie("pat-sin-hog")
      let user_id = ""

      if (!token) {
        return response.status(401).json({ message: 'Token JWT inválido' });
      }
      try {
        const decoded = await jwt.verify(token, process.env.JWT_TOKEN);
        user_id = decoded.user_id;

      } catch (error) {
        return response.status(403).json({ message: 'Error al verificar el token:' });
      }
      // Obtener los datos de la solicitud
      const petData = request.body()
      const petPhoto = request.file("pet_photo")

      if (!petPhoto) {
        return response.status(400).json({
          message: 'No se proporcionó ninguna imagen',
        });
      }
      const uploadedPhoto = await cloudinary.uploader.upload(petPhoto.tmpPath!, {
        upload_preset: 'patSinHog',
        folder: 'Imagenes_lostPets'
      });
      const imageUrl = uploadedPhoto.secure_url;

      await LostPet.create({
        ...petData,
        user_id: user_id,
        pet_photo: imageUrl,
      });
      return response.status(200).json({ message: 'La mascota perdida  fue publicada' });
    } catch (e) {
      return response.status(500).json({ message: 'Hubo un error al publicar  la mascota' });
    }
  }

  public async getLostPets({ request, response }: HttpContextContract) {

    const page = request.input('page', 1)
    const limit = cantidadMascotasAMostrar
    const offset = (page - 1) * limit
   
    const type = request.input("pet_type", "")
    const province = request.input("province", "")
    const location = request.input("location","")
    

    const isFilter = () => {
      return  type == "" && province == null && location == null;
    }

    if (isFilter()) {
      try {

        // Consulta para obtener las mascotas paginadas
        const lostPets = await LostPet.query().offset(offset).limit(limit)

        // Consulta para obtener el total de mascotas
        const totalMascotas = await LostPet.query().count('* as total').first()
        const numTotal = totalMascotas ? totalMascotas.$extras.total : 0;

        const totalPaginas = Math.ceil(numTotal / limit);

        return response.json({ lostPets, totalPaginas })
      } catch (error) {
        return response.status(500).json({ error: 'Error al obtener mascotas.' })
      }
    } else {
      try {

        let mascotasQuery = LostPet.query();


        if (type !== '') {
          mascotasQuery = mascotasQuery.where("pet_type", type);
        }


        if (province !== '') {
          mascotasQuery = mascotasQuery.where("pet_province", province);
        }

        if (location !== '') {
          mascotasQuery = mascotasQuery.where("pet_location", location);
        }

        // Ejecutar la consulta con filtros paginados
        const lostPets = await mascotasQuery.offset(offset).limit(limit);

        // Consulta para obtener el total de mascotas con filtros aplicados
        const totalMascotas = await mascotasQuery.count('* as total').first();
        const numTotal = totalMascotas ? totalMascotas.$extras.total : 0;
        const totalPaginas = Math.ceil(numTotal / limit);

        return response.json({ lostPets, totalPaginas });

      } catch (error) {
        return response.status(500).json({ error: 'Error al obtener mascotas con filtros.' });
      }
    }
  }

  public async getUserLostPets({ request, response }: HttpContextContract) {

    const page = request.input('page', 1)
    const limit = cantidadMascotasAMostrar
    const offset = (page - 1) * limit

    try {
      const token = request.cookie('pat-sin-hog')
      let userId = ''


      if (!token) {
        return response.status(401).json({
          message: ' Token invalido'
        })
      }
      try {
        const decoded = await jwt.verify(token, process.env.JWT_TOKEN)
        userId = decoded.user_id

      }
      catch (e) {
        return response.status(401).json({
          message: 'Error al verificar el token:'
        })
      }
      try {

         // Consulta para obtener las mascotas del usuario paginadas
         const lostPets = await LostPet.query().where('user_id', userId).from('lost_pets').offset(offset).limit(limit)

         // Consulta para obtener el total de mascotas
         const totalMascotas = await LostPet.query().count('* as total').first()
         const numTotal = totalMascotas ? totalMascotas.$extras.total : 0;
 
         const totalPaginas = Math.ceil(numTotal / limit);
 
         
         return response.json({ lostPets, totalPaginas })

      }
      catch (e) {
        response.status(401).json({ message: 'Error al encontrar las mascotas' })
      }
    }
    catch (e) {
      response.status(500).json({
        message: "Hubo un error al cargar las mascotas"
      })
    }
  }

  public async updateLostPet({ request, response }: HttpContextContract) {
    try {
      const petData = request.body()
      //Si hay imagen nueva 
      const filePet = request.file("pet_photo")
      const findPet = await LostPet.findBy("pet_id", petData.pet_id)

      if (findPet) {
        if (filePet === null) {
          delete petData.url_image
          await LostPet.query().where("pet_id", petData.pet_id).from("lost_pets").update(petData)
          response.status(200).json({
            message: "Mascota actualizada  exitosamente"
          })
        } else {
          //obtener la url de la carpeta e imagen cloudinary
          const imageUrl = petData.url_image
          const urlArray = imageUrl.split('/')
          const folder = urlArray[urlArray.length - 2]
          const imageName = urlArray[urlArray.length - 1].split('.')[0]
          const image = folder + "/" + imageName

          cloudinary.uploader.destroy(image, function (error, result) {
            if (error) {
              response.status(401).json({
                meesage: "Error al eliminar la imagen ", error
              })
            } else {
              response.status(200).json({
                message: "Imagen eliminada exitosamente", result
              })
            }
          });

          const uploadedPhoto = await cloudinary.uploader.upload(filePet.tmpPath!, {
            upload_preset: 'patSinHog',
            folder: 'Imagenes_lostPets'

          });

          const urlFile = uploadedPhoto.secure_url;
          delete petData.url_image
          const dataUpdate = {
            ...petData,
            pet_photo: urlFile
          }

          await LostPet.query().where("pet_id", petData.pet_id).from("lost_pets").update(dataUpdate)
          response.status(200).json({
            message: "Mascota actualizada exitosamente"
          })
        }
      } else {
        response.status(401).json({
          message: "No se encontro a la mascota"
        })
      }

    } catch (e) {
      response.status(500).json({
        message: "No se pudo actualizar  la mascota"
      })
    }
  }

  public async deleteLostPet({ request, response }: HttpContextContract) {
    try {
      const data = request.body()

      const findPet = await LostPet.findBy('pet_id', data.pet_id)
      //obtener la url de la carpeta e imagen cloudinary
      const imageUrl = data.pet_photo
      const urlArray = imageUrl.split('/')
      const folder = urlArray[urlArray.length - 2]
      const imageName = urlArray[urlArray.length - 1].split('.')[0]
      const image = folder + "/" + imageName

      if (findPet) {
        
        await LostPet.query().where('pet_id', data.pet_id).from('lost_pets').delete()

        //borrar la imagen en clkoudinary con sus respectivos errores
        cloudinary.uploader.destroy(image, function (error, result) {
          if (error) {
            response.status(401).json({
              meesage: "Error al eliminar la imagen "
            })
          } else {
            response.status(200).json({
              message: "Imagen eliminada exitosamente", result
            })
          }
        });
        response.status(200).json({
          message: 'Mascota eliminada correctamente'
        });
      } else {
        response.status(401).json({
          message: " No se encontro a la mascota"
        })
      }
    } catch (e) {
      response.status(500).json({
        message: 'Error al eliminar la mascota'
      });
    }
  }
}


