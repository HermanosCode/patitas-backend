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
import Route from '@ioc:Adonis/Core/Route'


Route.group(() => {
  // Ruta para iniciar sesion
  Route.post('/singIn','LoginController.singIn')
}).prefix('/logIn')




Route.group(() => {
  // Ruta para crear un nuevo usuario
  Route.post('/register','LoginController.createUser')
  //Ruta para eliminar un usuario
  Route.delete('/delete/:user_id','LoginController.deleteUser')
}).prefix('/user')


//Ruta para publicar una mascota
Route.post('/publicar','PetController.createPet')

Route.delete('/logout', async ({ response }) => {
  response.clearCookie('pat-sin-hog');
  return response.status(200).json({ message: 'Sesión cerrada exitosamente' });
});