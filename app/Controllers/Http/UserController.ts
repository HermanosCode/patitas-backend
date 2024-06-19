import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Pet from 'App/Models/Pet';

import User from 'App/Models/User';
import jwt from 'jsonwebtoken';

export default class UserController {


  /* Method :  Create de un usuario 
  * Request :  Recibe en el body un JSON con los datos del usuario a crear  => user_email , user_password
  * Response : Retorna codigo de respuesta y un mensaje 
  */
  public async createUser({ request, response }: HttpContextContract) {

    try {
      // Obtener datos de la solicitud
      const userData = request.body();

      // Verificar si el email ya está registrado
      const userEmail = await User.findBy('user_email', userData.user_email);

      if (userEmail) {
        // Si el email ya está registrado, devuelve un error
        response.status(400).json({
          message: 'El email ingresado ya se encuentra registrado'
        })
      } else {
        // Crea un nuevo usuario en la base de datos 
        const userCreated = await User.create(userData);

        // Generar el token JWT
        const token = jwt.sign({ user_id: userCreated.user_id }, process.env.JWT_TOKEN);

        // Establecer el token JWT en una cookie en la respuesta HTTP
        response.cookie('pat-sin-hog', token);

        // Responder con éxito con un mensaje
        response.status(200).json({
          message: 'El usuario ha sido creado'
        });
      }

    }
    catch (e) {
      // Manejar error con mensaje
      response.status(500).json({
        message: 'Error interno del servidor'
      })
    }
  }

  /* Method :  Delete de un usuario 
  * Request :  Recibe en el params el user_id para borrar el usuario
  * Response : Retorna codigo de respuesta y un mensaje 
  */
  public async deleteUser({ params, response }: HttpContextContract) {

    try {
      // Busca al usuario indicado
      const user = await User.find(params.user_id)

      if (user) {
        // Si el usuario existe, eliminarlo
        await user.delete()
        response.status(200).json({
          message: 'El usuario ha sido borrado correctamente'
        })
      } else {
        // Si el usuario no se encuentra, devuelve un error
        response.status(400).json({
          message: 'El usuario no se ha encontrado'
        })
      }
    }
    catch (e) {
      // Manejar error interno del servidor
      response.status(500).json({
        message: 'Error interno del servidor'
      })
    }
  }

  public async addFavoritePet({ request, response }: HttpContextContract) {
    try {
      const token = request.cookie('pat-sin-hog')
      const { pet_id } = request.body()
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
      const user = await User.findBy("user_id", userId)

      if (!user) {
        response.status(401).json({
          message: "No se encontro el usuario"
        })
      } else {

        let favoritesPets = user.favorites_pets;

        if (!favoritesPets.includes(pet_id)) {
          favoritesPets.push(pet_id);

          // Convertir la lista de mascotas favoritas a una cadena JSON
          const favoritesPetsJSON = JSON.stringify(favoritesPets);

          user.favorites_pets = [favoritesPetsJSON];

          // Guardar los cambios en la base de datos
          await user.save();

          return response.status(200).json({
            message: 'Mascota agregada a favoritos correctamente'
          });
        }
      }

    } catch (e) {
      response.status(500).json({
        message: "Error interno del servidor"
      })
    }
  }

  public async deleteFavoritePet({ request, response }: HttpContextContract) {
    try {
      const token = request.cookie('pat-sin-hog')
      const { pet_id } = request.body()
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

      const user = await User.findBy("user_id", userId)

      if (!user) {
        response.status(401).json({
          message: "No se encontro el usuario"
        })
      } else {

        let favoritesPets = user.favorites_pets;

        if (favoritesPets.includes(pet_id)) {

          favoritesPets = favoritesPets.filter(pet => pet !== pet_id);

          // Convertir la lista de mascotas favoritas a una cadena JSON
          const favoritesPetsJSON = JSON.stringify(favoritesPets);

          user.favorites_pets = [favoritesPetsJSON];

          // Guardar los cambios en la base de datos
          await user.save();

          return response.status(200).json({
            message: 'Mascota sacado de favoritos correctamente'
          });
        }
      }

    } catch (e) {
      response.status(500).json({
        message: "Error interno del servidor"
      })
    }
  }

  public async getFavoritesPets({ request, response }: HttpContextContract) {
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

      const user = await User.findBy("user_id", userId)

      if (!user) {
        response.status(401).json({
          message: "No se encontro el usuario"
        })
      } else {

        const favoritesPets = await User.query().where("user_id", userId).from("users").select('favorites_pets');
        const petsList = favoritesPets[0]?.favorites_pets
        response.json({ favoritesPets: petsList });
      }
    } catch (e) {
      response.status(500).json({
        message: "Error interno del servidor"
      })
    }
  }

  public async getFavoritesDataPets({ request, response }: HttpContextContract) {
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

      const user = await User.findBy("user_id", userId)

      if (!user) {
        response.status(401).json({
          message: "No se encontro el usuario"
        })
      } else {

        const favoritesPets = await User.query().where("user_id", userId).from("users").select('favorites_pets');
        const petsList = favoritesPets[0]?.favorites_pets
       
        const dataFavoritesPets = await Pet.query().whereIn('pet_id', petsList)

        response.json({ favoritesPetsData: dataFavoritesPets });
      }
    } catch (e) {
      response.status(500).json({
        message: "Error interno del servidor"
      })
    }
  }


}