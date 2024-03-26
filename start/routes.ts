/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
*/
import Route from '@ioc:Adonis/Core/Route'







Route.get('/getPets', "PetController.getPets")

Route.group(() => {

  // Ruta para iniciar sesión
  Route.post('/login', 'AuthController.login')

  // Ruta para cerrar sesión
  Route.delete('/logout', 'AuthController.logout')


}).prefix('/auth')



//Grupo de rutas para usuario

Route.group(() => {

  // Ruta para crear un usuario
  Route.post('/create', 'UserController.createUser')

  //Ruta para eliminar un usuario
  Route.delete('/delete/:user_id', 'UserController.deleteUser')

}).prefix('/user')


//Grupo de rutas para mascotas

Route.group(() => {

  // Ruta para crear una mascota
  Route.post('/publish', 'PetController.createPet')

}).prefix('/pet')



