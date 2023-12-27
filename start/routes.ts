/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/
import Database from '@ioc:Adonis/Lucid/Database'
import Route from '@ioc:Adonis/Core/Route'


Route.get('/users', async () => {
  return Database.from('users').select('*')
})




Route.group(() => {
  // Ruta para iniciar sesion,verificando  si el email existe y la contraseña es correcta
  Route.post('/singIn','LoginController.verifyUser')
}).prefix('/logIn')




Route.group(() => {
  // Ruta para crear un nuevo usuario, y fijarse si el mail a registrar ya esta usado 
  Route.post('/register','LoginController.createUser')
  //Ruta para eliminar un usuario
  Route.delete('/delete/:user_id','LoginController.deleteUser')
}).prefix('/user')




