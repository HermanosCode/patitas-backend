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

  //Ruta para agregar mascota favorita
  Route.put('/addFavorite','UserController.addFavoritePet')

  Route.put("/deleteFavorite","UserController.deleteFavoritePet")

  Route.get("/getFavoritesPets","UserController.getFavoritesPets")

  Route.get("/getFavoritesDataPets","UserController.getFavoritesDataPets")


}).prefix('/user')


//Grupo de rutas para mascotas

Route.group(() => {

  Route.get('/getPets', "PetController.getPets")

  Route.put("/adoptPet","PetController.adoptPet")

  //Ruta para obtener mascotas del usuario
  Route.get('/getUserPets','PetController.getUserPets')

  //Ruta para obtener mascotas adoptadas del usuario
  Route.get("/getAdoptedPets","PetController.getAdoptedPet")

  Route.put("/updatePet","PetController.updatePet")

  Route.delete('/delete',"PetController.deletePet")

  // Ruta para crear una mascota
  Route.post('/publish', 'PetController.createPet')

}).prefix('/pet')



