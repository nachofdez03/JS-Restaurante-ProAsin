// MODEL

// Importamos las excepciones mediante un modulos
import {
  BaseException,
  ParameterInvalidException,
  ExistsException,
  NoRegistryException,
} from "./Excepciones.js";

// Clase Dish
class Dish {
  #name;
  #description;
  #ingredients;
  #image;

  constructor(name, description, ingredients = [], image) {
    this.#name = name;
    this.#description = description;
    this.#ingredients = [];
    this.#image = image;
  }
  get name() {
    return this.#name;
  }
  get description() {
    return this.#description;
  }
  get ingredients() {
    return this.#ingredients;
  }
  get image() {
    return this.#image;
  }
  set name(newName) {
    this.#name = newName;
  }
  set description(newDescription) {
    this.#description = newDescription;
  }
  set ingredients(newIngredients) {
    this.#ingredients = newIngredients;
  }
}

// Clase Category
class Category {
  #name;
  #description;

  constructor(name, description) {
    this.#name = name;
    this.#description = description;
  }
  get name() {
    return this.#name;
  }
  get description() {
    return this.#description;
  }
  set name(newName) {
    this.#name = newName;
  }
  set description(newDescription) {
    this.#description = newDescription;
  }
}

// Clase allergen
class Allergen {
  #name;
  #description;

  constructor(name, description) {
    this.#name = name;
    this.#description = description;
  }
  get name() {
    return this.#name;
  }
  get description() {
    return this.#description;
  }
  set name(newName) {
    this.#name = newName;
  }
}

// Clase Menu
class Menu {
  #name;
  #description;

  constructor(name, description) {
    this.#name = name;
    this.#description = description;
  }

  get name() {
    return this.#name;
  }
  get description() {
    return this.#description;
  }

  set name(newName) {
    this.#name = newName;
  }
}

// Clase Restaurante
class Restaurant {
  #name;
  #description;
  #location;

  constructor(name, description, location) {
    this.#name = name;
    this.#description = description;
    this.#location = location;
  }
  get name() {
    return this.#name;
  }
  get description() {
    return this.#description;
  }
  get location() {
    return this.#location;
  }
  set name(newName) {
    this.#name = newName;
  }
  set description(newDescription) {
    this.#description = newDescription;
  }
}
// Clase Coordenadas
class Coordinate {
  #latitude;
  #longitude;
  constructor(latitude, longitude) {
    this.#latitude = latitude;
    this.#longitude = longitude;
  }
  get latitude() {
    return this.#latitude;
  }
  get longitude() {
    return this.#longitude;
  }
}

// Singlenton de Restaurant Manager, gracias a esto solo se podra instanciar una vez
let RestaurantsManager = (function () {
  let instance;

  // Clase RestaurantManager donde estan las colecciones necesarias
  class RestaurantsManager {
    #systemName;
    #categories;
    #allergens;
    #dishes;
    #menus;
    #restaurants;

    constructor(systemName) {
      this.#systemName = systemName;
      this.#categories = [];
      this.#allergens = [];
      this.#dishes = [];
      this.#menus = [];
      this.#restaurants = [];
    }

    get systemName() {
      return this.#systemName;
    }

    // Mediante un generador conseguimos los platos que hay en la coleccion
    *getterDishes() {
      for (const dishObj of this.#dishes) {
        yield dishObj.dish;
      }
    }
    // Otro generador pero aqui al ser los objetos directos y no dentro de objetos literales no hace falta un for of
    *getterCategories() {
      yield* this.#categories;
    }
    // Mediante un generador conseguimos los menus que hay en la coleccion
    *getterMenus() {
      for (const menuObj of this.#menus) {
        yield menuObj.menu;
      }
    }
    // Otro generador identico a las categorias pero con alergias
    *getterAllergens() {
      yield* this.#allergens;
    }
    // Otro generador
    *getterRestaurants() {
      yield* this.#restaurants;
    }

    // Añadimos las categorias
    addCategory(...Categories) {
      // Recorremos todas las categorias
      for (const category of Categories) {
        // Comprobamos que no son nulas y son objetos de categorias
        if (category == null || !(category instanceof Category))
          throw new ParameterInvalidException("Categoria");

        // Si ya existe
        if (this.#categories.includes(category))
          throw new ExistsException("Categoria");

        // La añadimos
        this.#categories.push(category);
      }
    }

    // Borramos la cateogoria
    removeCategory(...Categories) {
      // Las recorremos
      for (const category of Categories) {
        // Conseguimos el indice
        let index = this.#categories.indexOf(category);
        // Si existe se borra y si no lanzamos excepcion
        if (index != -1) {
          this.#categories.splice(index, 1);
        } else {
          throw new NoRegistryException(category.name);
        }
      }
    }

    // Añadimos el Menu
    addMenu(...menus) {
      // Los recorremos y hacemos las comprobaciones
      for (const menu of menus) {
        if (menu == null || !(menu instanceof Menu))
          throw new ParameterInvalidException("Menu");

        if (this.#menus.includes(menu)) throw new ExistsException("menu");

        // Y lo añadimos mediante un objeto literal para añadir la relacion
        this.#menus.push({
          menu,
          dishes: [],
        });
      }
    }

    // Borramos el menu
    removeMenu(...menus) {
      // Los recorremos
      for (const menu of menus) {
        // Sacamos el indice
        let index = this.#menus.findIndex((m) => m.menu == menu);
        // Si esta se borra y si no lanzamos excepcion
        if (index != -1) {
          this.#menus.splice(index, 1);
        } else {
          throw new NoRegistryException(menu.name);
        }
      }
    }

    // Añadimos Alergia
    addAllergen(...Allergens) {
      // Recorremos todad las alergias comprobando que son de tipo alergias y no son nulas
      for (const allergen of Allergens) {
        if (allergen == null || !(allergen instanceof Allergen))
          throw new ParameterInvalidException("Alergia");

        if (this.#allergens.includes(allergen))
          throw new ExistsException("Alergia");

        // Las añadimos
        this.#allergens.push(allergen);
      }
    }

    // Borramos Alergia
    removeAllergen(...Allergens) {
      // las recorremos y lanzamos excepciones si no estan bien implementadas
      for (const allergen of Allergens) {
        // Sacamos el indice y lo comprobamos
        let index = this.#allergens.indexOf(allergen);
        // Si esta se borra y si no lanzamos excepcion
        if (index != -1) {
          this.#allergens.splice(index, 1);
        } else {
          throw new NoRegistryException(allergen.name);
        }
      }
    }

    // Añadimos un plato
    addDish(...dishes) {
      // Recorremos los platos y comprobamos que estan correctamente implementados
      for (const dish of dishes) {
        if (dish == null || !(dish instanceof Dish))
          throw new ParameterInvalidException("Dish");

        if (this.#dishes.includes(dish)) throw new ExistsException("Dishes");

        // Los añadimos mediante objetos literales para cumplir la relacion
        this.#dishes.push({
          dish,
          categories: [],
          allergens: [],
        });
      }
    }

    // Borramos un plato
    removeDish(...dishes) {
      // Lo recorremos y comprobamos si estan bien implementados
      for (const dish of dishes) {
        // Comprobamos el indice
        let index = this.#dishes.findIndex((d) => d.dish === dish);
        // Si esta se borra y si no lanzamos excepcion
        if (index != -1) {
          this.#dishes.splice(index, 1);

          // Buscamos en el menu por si estuviera para borrarlo ahí tambien
          for (const menuObj of this.#menus) {
            let index = menuObj.dishes.indexOf(dish);
            if (index !== -1) {
              menuObj.dishes.splice(index, 1);
            }
          }
        } else {
          throw new NoRegistryException(dish.name);
        }
      }
    }

    // Añadimos un restaurante
    addRestaurant(...Restaurants) {
      // Recorremos los restaurantes y comprobamos que estan correctamente implementados
      for (const restaurant of Restaurants) {
        if (restaurant == null || !(restaurant instanceof Restaurant))
          throw new ParameterInvalidException("Restaurant");

        if (this.#restaurants.includes(restaurant))
          throw new ExistsException("restaurant");
        // Lo añadimos a la coleccion si esta correcto
        this.#restaurants.push(restaurant);
      }
    }

    // Borramos restaurante
    removeRestaurant(...Restaurants) {
      // Los recorremos
      for (const restaurant of Restaurants) {
        // Comprobamos el indice
        let index = this.#restaurants.indexOf(restaurant);
        // Si esta se borra y si no excepcion
        if (index != -1) {
          this.#restaurants.splice(index, 1);
        } else {
          throw new NoRegistryException(restaurant.name);
        }
      }
    }

    // Asignamos la categoria a un plato
    assignCategoryToDish(dish, ...categories) {
      // comprobamos excepcion
      if (dish == null) throw new ParameterInvalidException("Dish");
      const theDish = this.#dishes.find((d) => d.dish == dish);

      // Si el plato no esta en el sistema lo introducimos
      if (!theDish) {
        this.#dishes.push({
          dish,
          allergens: [],
          categories: [],
        });
      }

      // Si las categorias no estan en el sistema las introducimos
      for (const category of categories) {
        if (category == null) throw new ParameterInvalidException("Categorias");
        if (!this.#categories.includes(category)) {
          this.#categories.push(category);
        }
      }

      /* Ahora asignamos las categorias al plato, con esta linea conseguimos el objeto literal 
           donde va a estar el plato donde tenemos que asignarles las categorias */

      for (const category of categories) {
        if (!theDish.categories.includes(category)) {
          theDish.categories.push(category);
        }
      }
    }

    // Desasignamos una categoria a un plato
    deassignCategoryToDish(dish, ...categories) {
      // Buscamos el objeto literal donde esta ese plato
      const theDish = this.#dishes.find((d) => d.dish == dish);
      if (dish == null) throw new ParameterInvalidException("Dish");

      // Recorremos categorias
      for (const category of categories) {
        if (category == null || !theDish.categories.includes(category))
          throw new ParameterInvalidException("Dish");
        // Comprobamos indice de la categoria y si esta se desasigna
        let index = theDish.categories.indexOf(category);
        if (index != -1) {
          theDish.categories.splice(index, 1);
        }
      }
    }
    // Igual pero para las alergias
    assignAllergenToDish(dish, ...allergens) {
      // Excepciones
      if (dish == null) throw new ParameterInvalidException("Dish");
      const theDish = this.#dishes.find((d) => d.dish == dish);

      // Si no existe el plato, lo añadimos
      if (!theDish) {
        this.#dishes.push({
          dish,
          categories: [],
          allergens: [],
        });
      }

      // Si no existe la alergia, la añadimos comprobandolo
      for (const allergen of allergens) {
        if (allergen == null) throw new ParameterInvalidException("Allergen");
        if (!this.#allergens.includes(allergen)) {
          this.#allergens.push(allergen);
        }
      }

      // Asignamos la alergia al plato
      for (const allergen of allergens) {
        if (!theDish.allergens.includes(allergen)) {
          theDish.allergens.push(allergen);
        }
      }
    }

    // Lo mismo pero con alergias
    deassignAllergenToDish(dish, ...allergens) {
      // Sacamos el objeto literal del plato
      const theDish = this.#dishes.find((d) => d.dish == dish);
      if (dish == null || !theDish) throw new ParameterInvalidException("Dish");

      // Las recorremos una por una para comprobar que todo esta ok
      for (const allergen of allergens) {
        if (allergen == null || !theDish.allergens.includes(allergen))
          throw new ParameterInvalidException("Allergen");
        // Indice de la alergia y borramos si eciste
        let index = theDish.allergens.indexOf(allergen);
        if (index !== -1) {
          theDish.allergens.splice(index, 1);
        }
      }
    }
    assignDishToMenu(menu, ...dishes) {
      // Conseguimos el objeto literal donde esta el menu
      let theMenu = this.#menus.find((m) => m.menu === menu);
      if (menu == null) throw new ParameterInvalidException("Menu");

      // Si el menu no existe
      if (!theMenu) {
        this.#menus.push({
          menu,
          dishes: [],
        });
      }

      // Si algun plato no existe
      for (const dish of dishes) {
        if (dish == null) throw new ParameterInvalidException("Dish");
        let dishObj = this.#dishes.find((d) => d.dish == dish);
        // Creamos el plato porque es un objeto literal
        if (!dishObj) {
          dishObj = {
            dish,
            categories: [],
            allergens: [],
          };
          this.#dishes.push(dishObj);
        }
      }

      // Asignamos los platos al menu
      for (const dish of dishes) {
        if (!theMenu.dishes.includes(dish)) {
          theMenu.dishes.push(dish);
        }
      }
    }
    // Desasignamos plato del menu
    deassignDishToMenu(menu, ...dishes) {
      // Objeto literal conseguido
      const theMenu = this.#menus.find((m) => m.menu == menu);
      if (menu == null || !theMenu) throw new ParameterInvalidException("Menu");

      // Recorremos platos
      for (const dish of dishes) {
        if (dish == null || !theMenu.dishes.includes(dish))
          throw new ParameterInvalidException("dish");

        // Indice del plato
        let index = theMenu.dishes.indexOf(dish);
        if (index !== -1) {
          // Borramos
          theMenu.dishes.splice(index, 1);
        }
      }
    }
    // Cambiamos posiciones del menu
    changeDishesPositionsInMenu(menu, dish, dish2) {
      // Conseguimos Objeto literal del menu
      const theMenu = this.#menus.find((m) => m.menu == menu);
      if (menu == null || !theMenu) throw new ParameterInvalidException("Menu");
      if (dish == null || dish2 == null)
        throw new ParameterInvalidException("dish");

      // Conseguimos el indice de los platos pasados por parametro

      let index = theMenu.dishes.indexOf(dish); // Indice Plato 1
      let index2 = theMenu.dishes.indexOf(dish2); // Indice Plato 2

      // Los intercambiamos
      theMenu.dishes[index] = dish2;
      theMenu.dishes[index2] = dish;
    }
    // Conseguimos los platos de alguna categoria
    *getDishesInCategory(category) {
      if (category == null || !(category instanceof Category))
        throw new ParameterInvalidException("Categoria");
      // metemos en un array las coincidencias para luego devolver el generador de esas coincidencias
      const dishesInCategory = this.#dishes
        .filter((dishObj) => dishObj.categories.includes(category))
        .map((dishObj) => dishObj.dish);

      // Ordenar los platos (puedes personalizar la lógica de ordenación según tus necesidades)
      dishesInCategory.sort((dish1, dish2) => {
        // Aquí puedes comparar propiedades relevantes para la ordenación
        // Por ejemplo, comparar por nombre
        return dish1.name.localeCompare(dish2.name);
      });

      // Devolver los platos ordenados
      yield* dishesInCategory;
    }

    // Igual pero con la alergia
    *getDishesWithAllergen(allergen) {
      if (allergen == null || !(allergen instanceof Allergen))
        throw new ParameterInvalidException("Allergen");
      // metemos en un array las coincidencias para luego devolver el generador de esas coincidencias
      let dishesAllergen = this.#dishes
        .filter((dishObj) => dishObj.allergens.includes(allergen))
        .map((dishObj) => dishObj.dish);

      dishesAllergen.sort((dish, dish2) => dish.name.localeCompare(dish2.name));

      yield* dishesAllergen;
    }
    // Conseguimos el objeto del menu para conseguir los platos
    *getDishesInMenu(menu) {
      const menuObj = this.#menus.find((menuObj) => menuObj.menu === menu);

      if (menuObj) {
        yield* menuObj.dishes;
      }
    }

    // Encontramos los platos
    findDishes(dish, callback) {
      let dishes = this.#dishes.filter(
        (dishObj) => dishObj === dish && callback(dishObj)
      );
      return platos[Symbol.iterator]();
    }

    // Creamos plato
    createDish(name, description, ingredients, image) {
      let index = this.#dishes.findIndex((dish) => dish.name == name);
      // Si esta registrado lo devuelve
      if (index !== -1) {
        return this.#dishes[index].dish;
      } else {
        // Si no lo crea y lo registra
        let dish = new Dish(name, description, ingredients, image);
        this.#dishes.push({
          dish,
          categories: [],
          allergens: [],
        });
        return dish;
      }
    }
    // Creamos Menu
    createMenu(name, description) {
      let index = this.#menus.findIndex((menu) => menu.name == name);
      // Si esta registrado lo devuelve
      if (index != -1) {
        return this.#menus[index];
      } else {
        // Si no lo crea y lo registra
        let menu = new Menu(name, description);
        this.#menus.push({
          menu,
          dishes: [],
        });
        return menu;
      }
    }
    // Creamos Alergia
    createAllergen(name, description) {
      let index = this.#allergens.findIndex(
        (allergen) => allergen.name == name
      );
      // Si esta registrado lo devuelve
      if (index != -1) {
        return this.#allergens[index];
      } else {
        // Si no lo crea y lo registra
        let allergen = new Allergen(name, description);
        this.#allergens.push(allergen);
        return allergen;
      }
    }
    // Creamos la categoria
    createCategory(name, description) {
      let index = this.#categories.findIndex(
        (categorie) => categorie.name == name
      );
      // Si esta registrado lo devuelve
      if (index != -1) {
        return this.#categories[index];
      } else {
        // Si no lo crea y lo registra
        let categorie = new Category(name, description);
        this.#categories.push(categorie);
        return categorie;
      }
    }
    // Creamos restaurante
    createRestaurant(name, description, location) {
      let index = this.#restaurants.findIndex(
        (restaurant) => restaurant.name == name
      );
      // Si esta registrado lo devuelve
      if (index != -1) {
        return this.#restaurants[index];
      } else {
        // Si no lo crea y lo registra
        let restaurant = new Restaurant(name, description, location);
        this.#restaurants.push(restaurant);
        return restaurant;
      }
    }

    getCategory(categoryName) {
      return this.#categories.find(
        (category) => category.name === categoryName
      );
    }

    getAllergen(allergenName) {
      return this.#allergens.find((allergen) => allergen.name === allergenName);
    }

    getRestaurant(restaurantName) {
      return this.#restaurants.find(
        (restaurant) => restaurant.name == restaurantName
      );
    }

    getMenu(menuName) {
      const menu = this.#menus.find((menu) => menu.menu.name === menuName);

      return menu.menu; // Devuelve el plato encontrado
    }

    getDish(dishName) {
      const dish = this.#dishes.find((entry) => entry.dish.name === dishName);

      return dish.dish; // Devuelve el plato encontrado
    }
  }
  // Esto es lo que devolvemos, una instancia que solo podra ser una
  return {
    getInstance: function (systemName) {
      if (!instance) {
        instance = new RestaurantsManager(systemName);
      }
      return instance;
    },
  };
})();

// Exportamos las clases
export default RestaurantsManager;
export { Dish, Category, Allergen, Menu, Restaurant, Coordinate };
