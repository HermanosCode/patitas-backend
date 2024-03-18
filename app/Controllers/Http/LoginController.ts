import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';



export default class LoginController {



  public async singIn({ response, request }: HttpContextContract) {

    try {
      //Obtiene los datos deseados 
      const { user_email, user_password } = request.only(['user_email', 'user_password']);

      //busca el email en la base de datos 
      const user = await User.findBy('user_email', user_email)

      //Verifica que el email exista y compara las contraseñas
      const passwordCorrect = user === null ? false : await bcryptjs.compare(user_password, user.user_password)

      if (!(user && passwordCorrect)) {
        response.status(400).json({
          message: 'Email o contraseña incorrecta'
        })

      }
      else {


        // Generar el token JWT
        const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_TOKEN);
        // Establecer el token JWT en una cookie en la respuesta HTTP
        response.cookie('pat-sin-hog', token, { httpOnly: true }); //REVIEW COOKIE VALUE

        // Enviar la respuesta
        response.status(200).json({
          message: 'Inicio de sesión exitoso'
        });
        //console.log(await request.cookie('patsinhog'))
      }
    }

    catch (e) {
      response.status(500).json({
        message: 'Error interno del servidor'
      })
    }

  }


  public async createUser({ request, response }: HttpContextContract) {

    try {
      //Obtener datos de la solicitud
      const userData = request.all();

      //Verificar si el email ya esta registrado
      const email = await User.findBy('user_email', userData.user_email);

      if (email) {
        response.status(400).json({
          message: 'El email ingresado ya se encuentra registrado'
        })
      } else {
        // Crea un nuevo usuario en la base de datos 
        await User.create(userData)
        //Responder con exito con msg
        response.status(200).json({
          message: 'El usuario ha sido creado'
        });
      }

    }
    catch (e) {
      //Manejar error con msg
      response.status(500).json({
        message: 'Error interno del servidor'
      })
    }
  }


  public async deleteUser({ params, response }: HttpContextContract) {

    try {
      //Busca al usuario indicado
      const user = await User.find(params.user_id)


      if (user) {
        await user.delete()
        response.status(200).json({
          message: 'El usuario ha sido borrado correctamente'
        })
      } else {
        response.status(400).json({
          message: 'El usuario no se ha encontrado'
        })
      }
    }
    catch (e) {
      response.status(500).json({
        message: 'Error interno del servidor'
      })
    }
  }




}


