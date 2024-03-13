import RestaurantsManager from "./Restaurant.js";
import RestaurantController from "./RestaurantController.js";
import RestaurantView from "./RestaurantView.js";
import AuthenticationService from "./authentication.js";

// Ahora vamos a instanciar un controlador a partir del Modelo y la Vista
const RestaurantApp = new RestaurantController(
  RestaurantsManager.getInstance(),
  new RestaurantView(),
  AuthenticationService.getInstance()
);

// Escucha el evento popstate, que se dispara cuando el usuario navega hacia adelante o hacia atrás en la historia del navegador
window.addEventListener("popstate", (event) => {
  // Verifica si hay un estado en el evento (información asociada con la entrada del historial)
  if (event.state) {
    // Llama a la función correspondiente según la acción almacenada en el estado
    historyActions[event.state.action](event);
  }
});

// Objeto que contiene funciones asociadas con acciones específicas del historial
const historyActions = {
  init: () => {
    RestaurantApp.handleInit();
  },
  // Acción 'dishCategoryList', por ejemplo, llama a la función handleDishesCategoryMenu de RestaurantApp
  dishCategoryListMenu: (event) =>
    RestaurantApp.handleDishesCategoryMenu(event.state.category),

  dishAllergenList: (event) =>
    RestaurantApp.handleDishesAllergenMenu(event.state.allergen),

  dishCategoryList: (event) =>
    RestaurantApp.handleDishesCategoryMenu(event.state.category),

  randomDish: (event) => RestaurantApp.handleDishInformation(event.state.dish),

  menuList: (event) => RestaurantApp.handleDishesMenusMenu(event.state.menu),

  restaurantList: (event) =>
    RestaurantApp.handleRestaurant(event.state.restaurant),

  dishBind: (event) => RestaurantApp.handleDishInformation(event.state.dish),

  newDish: (event) => RestaurantApp.handleNewDishForm(),

  removeDish: (event) => RestaurantApp.handleRemoveDishForm(),

  removeDishByAllergen: (event) => {
    RestaurantApp.handleRemoveDishByAllergens(event.state.allergen);
  },
  removeDishByCategory: (event) => {
    RestaurantApp.handleRemoveDishByCategory(event.state.category);
  },
  assignDish: () => {
    RestaurantApp.handleAssignDish();
  },
  desAssignDish: () => {
    RestaurantApp.handlDesssingDish();
  },
  newCategory: () => {
    RestaurantApp.handleNewCategory();
  },
  newRestaurant: () => {
    RestaurantApp.handleNewRestaurantForm();
  },

  newRestaurant: () => {
    RestaurantApp.handleNewRestaurantForm();
  },
};

// Reemplaza el estado actual en la historia del navegador con un nuevo estado ('init' en este caso)
history.replaceState({ action: "init" }, null);

export default RestaurantApp;
