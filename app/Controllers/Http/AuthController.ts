import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';



export default class AuthController {

  /* Method :  Login de un usuario 
  * Request :  Recibe en la request los datos del usuario a logear => user_email , user_password
  * Response : Retorna codigo de respuesta y un mensaje 
  */
  public async login({ response, request }: HttpContextContract) {

    try {

      // Obtiene los datos de usuario y contraseña del cuerpo de la solicitud
      const { user_email, user_password } = request.body();

      // Busca el usuario por su email en la base de datos
      const user = await User.findBy('user_email', user_email)

      // Verifica si el usuario existe y si la contraseña es correcta
      const passwordCorrect = user === null ? false : await bcryptjs.compare(user_password, user.user_password)

      // Si el usuario o la contraseña no son correctos, devuelve un error
      if (!(user && passwordCorrect)) {
        response.status(400).json({
          message: 'Email o contraseña incorrecta'
        })

      }
      else {
        // Genera un token JWT con el ID del usuario
        const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_TOKEN);

        // Establece el token JWT en una cookie en la respuesta HTTP
        response.cookie('pat-sin-hog', token);

        // Envía una respuesta exitosa
        response.status(200).json({
          message: 'Inicio de sesión exitoso'
        });
      }
    }

    catch (e) {
      // Si ocurre un error interno del servidor, devuelve un error 500
      response.status(500).json({
        message: 'Error interno del servidor'
      })
    }

  }

  /* Method :  Logout de un usuario 
  * Response : Retorna codigo de respuesta y un mensaje 
  */
  public async logout({ response }: HttpContextContract) {

    // Limpia la cookie de sesión del usuario
    response.clearCookie('pat-sin-hog');

    // Envía una respuesta indicando que la sesión ha sido cerrada exitosamente
    return response.status(200).json({ message: 'Sesión cerrada exitosamente' });
  }





}


