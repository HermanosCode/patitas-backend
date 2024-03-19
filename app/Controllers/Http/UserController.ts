import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
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
}
