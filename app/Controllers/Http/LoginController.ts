import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';


export default class LoginController {

  public async verifyUser({ response, request }: HttpContextContract) {

    try {

      const { user_email, user_password } = request.only(['user_email', 'user_password']);

      //Verifica que el email exista en la base de datos 
      const user = await User.findBy('user_email', user_email)

      if (!user) {
        response.status(400).send('No se ha encontrado el email')

      }
      else {

        //Verifica que la contraseña sea correcta
        if (user_password === user.user_password) {
          response.status(200).send('')
        } else {
          response.status(400).send('La contraseña ingresada es incorrecta ')
        }
      }
    }
    catch (e) {
      console.log(e);
      response.status(500).send('Error interno del servidor')
    }
  }


  public async createUser({ request, response }: HttpContextContract) {

    try {

      //Obtener datos de la solicitud
      const userData = request.all();

      //Verificar si el email ya esta registrado
      const email = await User.findBy('user_email', userData.user_email);

      if (email) {
        response.status(400).send('El email ya se encuentra registrado')
      }else{
        // Crea un nuevo usuario en la base de datos 
      await User.create(userData)
      //Responder con exito con msg
      response.status(200).send('El usuario ha sido creado');
      }

    }
    catch (e) {
      //Manejar error con msg
      console.log(e);
      response.status(500).send('Error interno del servidor')
    }
  }


  public async deleteUser({params,response}: HttpContextContract) {
    
    try{
      const userId= await User.find(params.user_id)


      if(userId){
        await userId.delete()
        response.status(200).send('El usuario ha sido borrado correctamente')
      }else{
        response.status(400).send('El usuario no se ha encontrado')
      }
    }
    catch(e){
      console.log(e);
      response.status(500).send('Error interno del servidor')
    }
  }

}
