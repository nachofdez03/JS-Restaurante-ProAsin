// CONTROLADOR

import {
  Dish,
  Category,
  Allergen,
  Menu,
  Restaurant,
  Coordinate,
} from "./Restaurant.js";

import RestaurantsManager from "./Restaurant.js";
import { getCookie } from "./util.js";

// Creamos los Symbol que las usaremos como campos privados
const MODEL = Symbol("RestaurantModel");
const VIEW = Symbol("RestarantView");
const LOAD_RESTAURANT_OBJECTS = Symbol("Load Restaurant Objects");

// Uso de cookies y sesiones
const AUTH = Symbol("AUTH");
const USER = Symbol("USER");
const LANGUAGE = Symbol("LANGUAGE");

class RestaurantController {
  constructor(model, view, auth) {
    this[MODEL] = model; // Instancia de RestaurantManager
    this[VIEW] = view; // Instancia de RestaurantView
    this[AUTH] = auth; // Instancia de la autenticacion
    this[USER] = null; // Usuario

    this.onLoad(); // Se invocará cada vez que se inicia la página, por lo que meteremos en el método todo lo que queremos que se inicie
    this.onInit(); // El que ejecuta los métodos de la vista
    this.onAddCategory();
    this.onAddAllergen();
    this.onAddMenu();
    this.onAddRestaurant();

    this[VIEW].bindInit(this.handleInit); // El Onit de antes para cuando se reinicie, y aqui para cuando se le da
  }

  // Mediante un método de nombre de propiedad computado vamos a crear
  // Un método creado privado para instanciar los objetos
  [LOAD_RESTAURANT_OBJECTS]() {
    const nueces = this[MODEL].createDish("Nueces", "Nueces", ["Nueces"]);
    const boqueron = this[MODEL].createDish("Boqueron", "Boqueron con limon", [
      "Boqueron",
      "limon",
    ]);
    const sardinas = this[MODEL].createDish(
      "Sardinas",
      "Sardinas a la planca",
      ["Sardinas"]
    );
    const macarrones = this[MODEL].createDish(
      "Macarrones",
      "Macarrones con tomate",
      ["Macarrones", "Tomate"]
    );
    const ensalada = this[MODEL].createDish("Ensalada", "Ensalada alineada", [
      "Lechuga",
      "Tomate",
      "Aceite",
      "Vinagre",
    ]);
    const kebab = this[MODEL].createDish("Kebab", "Kebab Mixto", [
      "Pan de pita",
      "Carne de Pollo",
      "Ensalada",
      "Huevo",
    ]);

    const pizza = this[MODEL].createDish("Pizza", "Pizza barbacoa", [
      "Tomate",
      "Carne",
      "huevo",
      "queso",
    ]);
    const pizzaVegetariana = this[MODEL].createDish(
      "PizzaVegetariana",
      "Pizza vegetariana",
      ["Tomate", "Lechuga", "Cebolla", "Queso"]
    );

    const lionsRestaurant = this[MODEL].createRestaurant(
      "LionsRestaurant",
      "Restaurant / Bar",
      "New York"
    );
    const nachoRestaurant = this[MODEL].createRestaurant(
      "NachoRestaurant",
      "Restaurant",
      "Granada"
    );
    const ferniRestaurant = this[MODEL].createRestaurant(
      "FerniRestaurant",
      "Restaurant / Pub",
      "Ciudad Real"
    );

    const carne = this[MODEL].createCategory("carne", "Carne de vacuno");
    const pescado = this[MODEL].createCategory("pescado", "Pescado del mar");
    const verduras = this[MODEL].createCategory("verduras", "Verduras frescas");

    const alergiaHuevo = this[MODEL].createAllergen(
      "Huevo",
      "Alergia al Huevo"
    );
    const alergiaTomate = this[MODEL].createAllergen(
      "Tomate ",
      "Alergia al Tomate"
    );
    const alergiaPescado = this[MODEL].createAllergen(
      "Pescado",
      "Alergia al pescado"
    );
    const alergiaFrutosSecos = this[MODEL].createAllergen(
      "Frutos Secos",
      "Alergia a los frutos secos"
    );

    const menuCarne = this[MODEL].createMenu("Menu Carne", "Menu carnivoro");
    const menuVegetariano = this[MODEL].createMenu(
      "Menu Vegano",
      "Menu para vegetariano"
    );
    const menuDeLaCasa = this[MODEL].createMenu(
      "Menu de la casa",
      "Menu especial"
    );

    // Ahora añadimos las categorias y alergias a los platos, y los platos a los menus

    this[MODEL].assignCategoryToDish(kebab, carne, pescado);
    this[MODEL].assignCategoryToDish(ensalada, verduras, pescado);
    this[MODEL].assignCategoryToDish(boqueron, pescado);
    this[MODEL].assignCategoryToDish(macarrones, verduras, carne);
    this[MODEL].assignCategoryToDish(sardinas, pescado);
    this[MODEL].assignCategoryToDish(pizza, carne);
    this[MODEL].assignCategoryToDish(pizzaVegetariana, verduras);

    this[MODEL].assignAllergenToDish(nueces, alergiaFrutosSecos);
    this[MODEL].assignAllergenToDish(boqueron, alergiaPescado);
    this[MODEL].assignAllergenToDish(sardinas, alergiaPescado);
    this[MODEL].assignAllergenToDish(kebab, alergiaHuevo);
    this[MODEL].assignAllergenToDish(macarrones, alergiaTomate, alergiaHuevo);
    this[MODEL].assignAllergenToDish(pizza, alergiaTomate, alergiaHuevo);
    this[MODEL].assignAllergenToDish(ensalada, alergiaTomate, alergiaPescado);
    this[MODEL].assignAllergenToDish(
      pizzaVegetariana,
      alergiaTomate,
      alergiaHuevo
    );

    this[MODEL].assignDishToMenu(menuCarne, sardinas, boqueron, kebab);
    this[MODEL].assignDishToMenu(menuVegetariano, ensalada, macarrones, nueces);
    this[MODEL].assignDishToMenu(menuDeLaCasa, kebab, pizza, macarrones);
  }
  1;
  // Ahora creamos un método de aplicación que estará en el constructor, se invocará con cada recarga
  onLoad = () => {
    if (getCookie("accetedCookieMessage") !== "true") {
      this[VIEW].showCookiesMessage();
    }
    const userCookie = getCookie("activeUser");
    console.log(userCookie);
    if (userCookie) {
      const user = this[AUTH].getUser(userCookie);
      if (user) {
        this[USER] = user;
        this.onOpenSession();
      }
    } else {
      this[VIEW].showIdentificationLink();
      this[VIEW].bindIdentificationLink(this.handleLoginForm);
    }

    this[LOAD_RESTAURANT_OBJECTS]();
    this[VIEW].showCategoriesinMenu(this[MODEL].getterCategories()); // Mostrara las categorias en el menu del nav
    this[VIEW].showAllergensinMenu(this[MODEL].getterAllergens());
    this[VIEW].showMenusinMenu(this[MODEL].getterMenus());
    this[VIEW].showRestaurantsinMenu(this[MODEL].getterRestaurants());
  };

  // Ejecutará los métodos de la Vista, se invocará con reinicio de la aplicación o con petición del usuario
  // Evento
  onInit = () => {
    this[VIEW].showCategories(this[MODEL].getterCategories()); // Mostrará las imagenes al cargarse la página
    this[VIEW].RandomDishes(this[MODEL].getterDishes()); // Mostrará los platos random del menu
    this[VIEW].bindShowRandomDish(this.handleDishInformation);
  };

  // Se ejecuta cuando se pulse una categoria
  onAddCategory = () => {
    this[VIEW].bindCategoryDishesMenu(this.handleDishesCategoryMenu); // Muestra los platos de las categorias seleccionadas en el menu
    this[VIEW].bindCategoryDishes(this.handleDishesCategoryMenu); // Muestra los platos de las categorias seleccionadas en el menu
  };

  // Se ejecutará cuando se pulse un alérgeno
  onAddAllergen = () => {
    this[VIEW].bindAllergenDishesMenu(this.handleDishesAllergenMenu);
  };

  onAddMenu = () => {
    this[VIEW].bindMenuDishesMenu(this.handleDishesMenusMenu);
  };

  onAddRestaurant = () => {
    this[VIEW].bindRestaurantsDishesMenu(this.handleRestaurant);
  };

  // Manejador
  handleInit = () => {
    this.onInit();
  };

  onCloseSession() {
    this[USER] = null;
    this[VIEW].deleteUserCookie();
    this[VIEW].showIdentificationLink();
    this[VIEW].bindIdentificationLink(this.handleLoginForm);
    this[VIEW].removeAdminMenu();
  }

  onOpenSession() {
    this[VIEW].initHistory();
    this[VIEW].showAuthUserProfile(this[USER]);
    this[VIEW].showAdminMenu();
    this[VIEW].bindCloseSession(this.handleCloseSession);
    this[VIEW].bindAdminMenu(
      this.handleNewDishForm,
      this.handleRemoveDishForm,
      this.handleAssignDish,
      this.handlDesssingDish,
      this.handleNewCategory,
      this.handleRemoveCategoryForm,
      this.handleNewRestaurantForm
    );
  }

  // Manejador de dishes

  // Manejador para mostrar los platos de la categoria que has seleccionado
  handleDishesCategoryMenu = (categoryName) => {
    this[VIEW].dishh.replaceChildren();
    const category = this[MODEL].getCategory(categoryName);
    const dishes = this[MODEL].getDishesInCategory(category);
    this[VIEW].showDishes(dishes);

    // El metodo de mostrar platos estará disponible cuando se haya pulsado una categoria
    this[VIEW].bindShowDish(this.handleDishInformation); // Muestra los platos al seleccionar uno
  };

  handleDishesAllergenMenu = (AllergenName) => {
    this[VIEW].dishh.replaceChildren();
    // Sacamos la alergia
    console.log(AllergenName);
    const allergen = this[MODEL].getAllergen(AllergenName);
    // Sacamos todos los platos que tienen esa alergia
    const dishes = this[MODEL].getDishesWithAllergen(allergen);
    // Mostramos los platos
    this[VIEW].showDishes(dishes);

    this[VIEW].bindShowDish(this.handleDishInformation); // Muestra los platos al seleccionar uno
  };

  handleDishesMenusMenu = (menuName) => {
    // Sacamos la alergia
    console.log(menuName);
    this[VIEW].dishh.replaceChildren();
    const menu = this[MODEL].getMenu(menuName);
    // Sacamos todos los platos que tienen esa alergia
    const dishes = this[MODEL].getDishesInMenu(menu);
    // Mostramos los platos
    this[VIEW].showDishes(dishes);

    this[VIEW].bindShowDish(this.handleDishInformation); // Muestra los platos al seleccionar uno
  };

  handleRestaurant = (restaurantName) => {
    this[VIEW].dishh.replaceChildren();
    const restaurant = this[MODEL].getRestaurant(restaurantName);
    console.log("ajdhasuh");
    this[VIEW].showRestaurantInformation(restaurant);
  };

  // Manejador para enseñar la informacion de un plato
  handleDishInformation = (dishName) => {
    // Cogemos el plato
    console.log(dishName);
    const dish = this[MODEL].getDish(dishName);

    console.log("ES UNDEFINED??" + dish.name);
    this[VIEW].dishInformation(dish);
    this[VIEW].bindShowProductInNewWindow(this.handleShowProductInNewWindow);
  };

  // Handle que le pasaremos al método de capturar el botón con la información del plato
  handleShowProductInNewWindow = (dishName) => {
    const dish = this[MODEL].getDish(dishName);
    this[VIEW].showProductInNewWindow(dish);
    this[VIEW].closeWindow();
  };

  handleNewDishForm = () => {
    this[VIEW].showNewDishForm(
      this[MODEL].getterCategories(),
      this[MODEL].getterAllergens()
    );

    this[VIEW].bindNewDishForm(this.handleCreateDish);
  };

  handleRemoveDishForm = () => {
    this[VIEW].showRemoveDish(
      this[MODEL].getterCategories(),
      this[MODEL].getterAllergens()
    );
    this[VIEW].bindRemoveDishSelect(
      this.handleRemoveDishByAllergens,
      this.handleRemoveDishByCategory
    );
  };

  // Manejador para eliminar por categorias
  handleRemoveDishByCategory = (name) => {
    const category = this[MODEL].createCategory(name);
    this[VIEW].showRemoveDishList(this[MODEL].getDishesInCategory(category));
    this[VIEW].bindRemoveDish(this.handleRemoveDish);
  };

  // Manejador para eliminar por alergenos
  handleRemoveDishByAllergens = (name) => {
    const allergen = this[MODEL].createAllergen(name);
    this[VIEW].showRemoveDishList(this[MODEL].getDishesWithAllergen(allergen));
    this[VIEW].bindRemoveDish(this.handleRemoveDish);
  };

  handleAssignDish = () => {
    this[VIEW].showAssignDishForm(
      this[MODEL].getterMenus(),
      this[MODEL].getterDishes()
    );
    this[VIEW].bindAssignDishForm(this.handleAssignDishMenu);
  };

  handlDesssingDish = () => {
    this[VIEW].showDesAssignDishForm(
      this[MODEL].getterMenus(),
      this[MODEL].getterDishes()
    );
    this[VIEW].bindDesAssignDishForm(this.handleDesAssingDishMenu);
  };

  handleNewCategory = () => {
    this[VIEW].showNewCategoryForm();
    this[VIEW].bindNewCategoryForm(this.handleCreateCategory);
  };

  handleRemoveCategoryForm = () => {
    this[VIEW].showRemoveCategoryForm(this[MODEL].getterCategories());
    this[VIEW].bindRemoveCategoryForm(this.handleRemoveCategory);
  };

  handleNewRestaurantForm = () => {
    this[VIEW].showNewRestaurantForm();
    this[VIEW].bindNewRestauranForm(this.handleCreateRestaurant);
  };

  handleCreateDish = (
    name,
    description,
    ingredients,
    categories,
    allergens
  ) => {
    // Creamos nuestro plato pasandole el nombre
    const newDish = this[MODEL].createDish(name);

    // Asignamos los demas valores al plato si estos existen
    if (description) newDish.description = description; // Añadimos descripcion

    // Pasamos la cadena de texto con los ingredientes a array y se lo añadimos a nuestro plato
    if (ingredients) newDish.ingredients = ingredients.split(",");

    let done;
    let error;

    // Ahora asignamos los alergenos y categorias al plato

    try {
      // Añadimos el plato lo primero de todo
      this[MODEL].addDish(newDish);
      console.log("lo añade?");

      categories.forEach((name) => {
        const category = this[MODEL].createCategory(name);

        this[MODEL].assignCategoryToDish(newDish, category);
      });

      allergens.forEach((name) => {
        const allergen = this[MODEL].createAllergen(name);
        this[MODEL].assignAllergenToDish(newDish, allergen);

        // Asignamos que todo fue correctamente
        done = true;
      });
    } catch (exeption) {
      // Si ha salido mal

      done = false;
      error = exeption;
    }

    this[VIEW].showDishModal(done, newDish, error);
  };

  // Manejador para la elimiacion del plato
  handleRemoveDish = (name) => {
    // Declaramos las variables de nuestro handler
    let done;
    let error;
    let dish;

    // Intentamos le borrado del plato
    try {
      // Obtenemos el plato que quremos eliminar
      dish = this[MODEL].createDish(name);

      // Eliminamos el plato
      this[MODEL].removeDish(dish);
      this.handleRemoveDishForm();

      // Indicamos que la operacion se ha cumplido
      done = true;
    } catch (exception) {
      done = false;
      error = exception;
    }

    // Llamamos a nuestro modal para mostrarle el resultado al ususario
    this[VIEW].showRemoveDishModal(done, dish, error);
  };

  // Asignacion de platos a menu
  handleAssignDishMenu = (menuName, dishes) => {
    // Declaramos las variables de nuestro handler
    let done;
    let error;
    let dishObj;
    let menuObj;

    try {
      // Recogemos el menu
      menuObj = this[MODEL].createMenu(menuName);

      // Iteramos sobre los platos y se lo asignamos al menu
      for (const dish of dishes) {
        // Recogemos el plato
        dishObj = this[MODEL].createDish(dish);

        // Asignamos el plato al menu
        this[MODEL].assignDishToMenu(menuObj, dishObj);
      }

      // Indicamos que la operacion se ha cumplido
      done = true;
    } catch (exception) {
      done = false;
      error = exception;
    }

    // Modal
    this[VIEW].showAssignDishModal(done, menuObj, error);
  };

  handleDesAssingDishMenu = (menuName, dishes) => {
    // Declaramos las variables de nuestro handler
    let done;
    let error;
    let dishObj;
    let menuObj;

    try {
      // Recogemos el menu
      menuObj = this[MODEL].createMenu(menuName);

      // Iteramos sobre los platos y se lo asignamos al menu
      for (const dish of dishes) {
        // Recogemos el plato
        dishObj = this[MODEL].createDish(dish.name);

        // Asignamos el plato al menu
        this[MODEL].deassignDishToMenu(menuObj, dishObj);
      }

      // Indicamos que la operacion se ha cumplido
      done = true;
    } catch (exception) {
      done = false;
      error = exception;
    }

    // Modal
    this[VIEW].showDesAssignDishModal(done, menuObj, error);
  };

  handleCreateCategory = (name, description) => {
    // Creamos la categoria pasandole el nombre
    const category = this[MODEL].createCategory(name);
    // Asignamos los demas valores
    if (description) category.description = description; // Añadimos descripcion

    // Tras realizar los pasos anteriores añadimos las categorias
    let done;
    let error;

    try {
      // Añadimos el plato al array
      this[MODEL].addCategory(category);
      this.onAddCategory();
      // Indicamos que las operaciones se han realizado de manera correcta
      done = true;
    } catch (exception) {
      console.log("estamos aqui");
      done = false;
      error = exception;
    }

    // Mostramos el modal de creacion
    this[VIEW].showNewCategoryModal(done, category, error);
  };

  // Eliminación de categoria
  handleRemoveCategory = (name) => {
    let done;
    let error;
    let category;

    try {
      category = this[MODEL].createCategory(name);
      // Borramos la categoria
      this[MODEL].removeCategory(category);
      // Actualizamos los datos
      this.handleRemoveCategoryForm();
      this.onAddCategory();
      done = true;
    } catch (exception) {
      done = false;
      error = exception;
    }

    // Modal
    this[VIEW].showRemoveCategoryModal(done, category, error);
  };

  // Creación del resturante
  handleCreateRestaurant = (name, description) => {
    // Creamos el restaurante pasandole el nombre
    const restaurant = this[MODEL].createRestaurant(name);
    // Asignamos los demas valores la restaurante
    if (description) restaurant.description = description; // Añadimos descripcion

    let done;
    let error;

    try {
      // Añadimos el plato al array
      this[MODEL].addRestaurant(restaurant);
      this.onAddRestaurant();
      // Indicamos que las operaciones se han realizado de manera correcta
      done = true;
    } catch (exception) {
      done = false;
      error = exception;
    }

    // Modal
    this[VIEW].showNewRestaurantModal(done, restaurant, error);
  };

  handleLoginForm = () => {
    this[VIEW].showLogin();
    this[VIEW].bindLogin(this.handleLogin);
  };

  handleLogin = (username, password, remember) => {
    if (this[AUTH].validateUser(username, password)) {
      this[USER] = this[AUTH].getUser(username);
      this.onOpenSession();
      console.log("Todo correcto");

      if (remember) {
        this[VIEW].setUserCookie(this[USER]);
      }
    } else {
      this[VIEW].showInvalidUserMessage();
    }
  };

  handleCloseSession = () => {
    this.onCloseSession();
    this.onInit();
    ShoppingCartApp.onInit();
    this[VIEW].initHistory();
  };
}

export default RestaurantController;
