import Pet from 'App/Models/Pet';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v2 as cloudinary } from 'cloudinary';
import jwt from "jsonwebtoken"
import { cantidadMascotasAMostrar } from '../../../common/constants';


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

        const decoded = await jwt.verify(token, process.env.JWT_TOKEN);


        user_id = decoded.user_id;
      } catch (error) {
        return response.status(403).json({ message: 'Error al verificar el token:' });
      }

      // Obtener los datos de la solicitud
      const petData = request.all();
      const petPhoto = request.file('pet_photo');
      const existingPet = await Pet.query().where('pet_name', petData.pet_name).where('user_id', user_id).first();

      if (existingPet) {
        return response.status(400).json({ message: 'La mascota ya existe' });
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

        await Pet.create({
          ...petData,
          user_id: user_id,
          pet_photo: imageUrl,
        });
      }
      return response.status(200).json({ message: 'La mascota fue publicada' });
    } catch (error) {
      return response.status(500).json({ message: 'Hubo un error al guardar la mascota' });
    }
  }



  public async getPets({ request, response }: HttpContextContract) {

    const page = request.input('page', 1)
    const limit = cantidadMascotasAMostrar
    const offset = (page - 1) * limit

    try {
      // Consulta para obtener las mascotas paginadas
      const mascotas = await Pet.query().whereNull("adopted_at").offset(offset).limit(limit)

      // Consulta para obtener el total de mascotas
      const totalMascotas = await Pet.query().count('* as total').first()
      const numTotal = totalMascotas ? totalMascotas.$extras.total : 0;
      const totalPaginas = Math.ceil(numTotal / limit);

      return response.json({ mascotas, totalPaginas })
    } catch (error) {
      return response.status(500).json({ error: 'Error al obtener mascotas.' })
    }
  }

  public async getUserPets({ request, response }: HttpContextContract) {
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
        const mascotasUser = await Pet.query().where('user_id', userId).whereNull("adopted_at").from('pets');

        response.json({ mascotasUser })
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


  public async deletePet({ request, response }: HttpContextContract) {
    try {
      const data = request.body()
      
      const findPet = await Pet.findBy('pet_id', data.pet_id)
      //obtener la url de la carpeta e imagen cloudinary
      const imageUrl = data.pet_photo
      const urlArray = imageUrl.split('/')
      const folder = urlArray[urlArray.length - 2]
      const imageName = urlArray[urlArray.length - 1].split('.')[0]
      const image = folder + "/" + imageName

      if (findPet) {
        await Pet.query().where('pet_id', data.pet_id).from('pets').delete()
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

  public async updatePet({ request, response }: HttpContextContract) {
    try {
      const petData = request.body()
      //Si hay imagen nueva 
      const filePet = request.file("pet_photo")
      const findPet = await Pet.findBy("pet_id", petData.pet_id)

      if (findPet) {
        if (filePet === null) {
          delete petData.url_image
          await Pet.query().where("pet_id", petData.pet_id).from("pets").update(petData)
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
            upload_preset: 'patSinHog'
  
          });
  
          const urlFile = uploadedPhoto.secure_url;
          delete petData.url_image
          const dataUpdate = {
            ...petData,
            pet_photo : urlFile
          }
          
          await Pet.query().where("pet_id", petData.pet_id).from("pets").update(dataUpdate)
          response.status(200).json({
            message : "Mascota actualizada exitosamente"
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


  public async adoptPet ({request,response}: HttpContextContract) {
    try {
      const  data  = request.body();
      
      await Pet.query().where("pet_id", data.pet_id).from("pets").update({
        adopted_at: new Date()
      });
      response.status(200).json({
        message: "Mascota adoptada"
      });
    } catch (error) {
      response.status(500).json({
        message: "No se pudo adoptar la mascota"
      });
    }
  }

  public async getAdoptedPet({request,response} : HttpContextContract) {
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
        const mascotasUser = await Pet.query().where('user_id', userId).whereNotNull("adopted_at").from('pets');

        response.json({ mascotasUser })
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

}