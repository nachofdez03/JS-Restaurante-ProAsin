// VISTA

import {
  newDishValidation,
  assignValidationForm,
  desAssignValidationForm,
  newCategoryValidationForm,
  newRestaurantValidationForm,
} from "./validation.js";
import { setCookie } from "./util.js";

// Definimos Symbol para implementar el método
const EXCECUTE_HANDLER = Symbol("excecuteHandler");

// Creamos la clase, declaramos las propiedades que vamos a utilizar más habitualmente
class RestaurantView {
  constructor() {
    this.main = document.getElementById("main");
    this.dishh = document.getElementById("dish");
    this.menu = document.querySelector(".lista.nav__lista"); // Menu de navegacion
    this.categories = document.getElementById("categories");
    this.preMain = document.getElementById("platosRandom");
    this.contador = 0; // Contador para el nombre al abrir una nueva ventana
    this.ventanas = []; // Array donde almacenamos las ventanas abiertas

    // Aqui guardaremos la referencia de la nueva ventana
    this.dishWindow = null;
  }

  [EXCECUTE_HANDLER](
    handler, // Función de manejo que se ejecutará
    handlerArguments, // Argumentos que se pasarán a la función de manejo
    scrollElement, // Elemento en la página hacia el cual se realizará un desplazamiento
    data, // Datos asociados con la entrada del historial
    url, // URL que se asocia con la entrada del historial
    event // Objeto de evento asociado con la acción
  ) {
    // Ejecuta la función de manejo con los argumentos proporcionados
    handler(...handlerArguments);

    // Busca el elemento en la página hacia el cual se realizará un desplazamiento
    const scroll = document.querySelector(scrollElement);

    // Log para depuración, imprime el elemento encontrado
    console.log(scroll);

    // Si se encuentra el elemento, realiza un desplazamiento suave hacia él
    if (scroll) {
      scroll.scrollIntoView();
    }
    // Agrega una nueva entrada al historial del navegador
    history.pushState(data, null, url);

    // Evita la acción predeterminada del evento (p. ej., la navegación normal de la página)
    event.preventDefault();
  }

  // Método para cada vez que se le de al inicio o al logo, se invoqué el método pasado por parmetro
  // prettier-ignore
  bindInit(handler) {
    document.getElementById('init').addEventListener('click', (event) => {
    this[EXCECUTE_HANDLER](handler, [], 'body', { action: 'init' }, '#',
    event);
    });
    document.getElementById('logo__image').addEventListener('click', (event) => {
    this[EXCECUTE_HANDLER](handler, [], 'body', { action: 'init' }, '#',
    event);
    });
    }

  // Iteramos sobre las categorias y las mostramos al inicio
  showCategories(categories) {
    this.categories.replaceChildren();
    // Si hay mas de un elemento hijo elimina el 2
    if (this.categories.children.length > 1)
      this.categories.children[1].remove();
    // Creamos el div que será dodne iteraremos con las categorias
    const container = document.createElement("div");
    container.id = "category-list";
    container.classList.add("row");

    for (const category of categories) {
      // Vamos insertando las categorias al final
      container.insertAdjacentHTML(
        "beforeend",
        `<div class="category-item"> ><a data-category="${
          category.name
        }" href="#product-list">
      <div><img class="category-image" alt="${category.name}" 
      src="${
        "./Multimedia/" + category.name + ".jpg"
      }" style="max-width: 100%; max-height: 550px;"/>
      </div>
      <div>
      <h3>${category.name}</h3>
      <div>${category.description}</div>
      </div>
      </a>
      </div>`
      );
    }
    this.categories.append(container);
  }

  showCategoriesinMenu(categories) {
    // Creamos el elemento li, que es el que añadiremos al final de la lista
    const li = document.createElement("li");
    li.classList.add("nav-item");
    li.classList.add("dropdown"); // Esta clasde de bootstrap conseguira que sea un menu despegable
    li.insertAdjacentHTML(
      "beforeend",
      `<a class="nav-link dropdown-toggle" 
      href="#product-list" id="navCats" role="button"
      data-bs-toggle="dropdown" aria-expanded="false">Categorías</a>`
    );
    // Creamos la lista ordenada que irá dentro del elemento li del menu
    const container = document.createElement("ul");
    container.classList.add("dropdown-menu");
    container.id = "lista__categorias";

    // Iteramos sobre las categorias para obtener la informacion que ira en la lista
    for (const category of categories) {
      container.insertAdjacentHTML(
        "beforeend",
        `<li><a data-category="${category.name}"
         class="dropdown-item" href="#product-list">${category.name}</a></li>`
      );
    }
    // Al elemento li que irá en el menu le añadimos las categorias que acabamos de crear
    li.append(container);
    // Y al menu de navegacion le añadimos li que es donde hemos metido todo
    this.menu.append(li);
  }

  // Mostrar alergenos en el menu
  showAllergensinMenu(allergens) {
    const li = document.createElement("li");
    li.classList.add("nav-item");
    li.classList.add("dropdown"); // Esta clasde de bootstrap conseguira que sea un menu despegable
    li.insertAdjacentHTML(
      "beforeend",
      `<a class="nav-link dropdown-toggle" 
      href="#" id="navAllerg" role="button"
      data-bs-toggle="dropdown" aria-expanded="false">Alergias</a>`
    );
    // Creamos la lista ordenada que irá dentro del elemento li del menu
    const container = document.createElement("ul");
    container.classList.add("dropdown-menu");
    container.id = "lista__allergenens";

    // Iteramos sobre las categorias para obtener la informacion que ira en la lista
    for (const allergen of allergens) {
      container.insertAdjacentHTML(
        "beforeend",
        `<li><a data-allergen="${allergen.name}"
         class="dropdown-item" href="#product-list">${allergen.name}</a></li>`
      );
    }
    // Al elemento li que irá en el menu le añadimos las categorias que acabamos de crear
    li.append(container);
    // Y al menu de navegacion le añadimos li que es donde hemos metido todo
    this.menu.append(li);
  }

  // Mostrar los menus en en menu nav
  showMenusinMenu(menus) {
    const li = document.createElement("li");
    li.classList.add("nav-item");
    li.classList.add("dropdown"); // Esta clasde de bootstrap conseguira que sea un menu despegable
    li.insertAdjacentHTML(
      "beforeend",
      `<a class="nav-link dropdown-toggle" 
      href="#" id="navMenus" role="button"
      data-bs-toggle="dropdown" aria-expanded="false">Menus</a>`
    );
    // Creamos la lista ordenada que irá dentro del elemento li del menu
    const container = document.createElement("ul");
    container.classList.add("dropdown-menu");
    container.id = "lista__menus";

    // Iteramos sobre las categorias para obtener la informacion que ira en la lista
    for (const menu of menus) {
      container.insertAdjacentHTML(
        "beforeend",
        `<li><a data-menu="${menu.name}"
         class="dropdown-item" href="#product-list">${menu.name}</a></li>`
      );
    }
    // Al elemento li que irá en el menu le añadimos las menus que acabamos de crear
    li.append(container);
    // Y al menu de navegacion le añadimos li que es donde hemos metido todo
    this.menu.append(li);
  }

  showRestaurantsinMenu(restaurants) {
    const li = document.createElement("li");
    li.classList.add("nav-item");
    li.classList.add("dropdown"); // Esta clasde de bootstrap conseguira que sea un menu despegable
    li.insertAdjacentHTML(
      "beforeend",
      `<a class="nav-link dropdown-toggle" 
      href="#" id="navRest" role="button"
      data-bs-toggle="dropdown" aria-expanded="false">Restaurants</a>`
    );
    // Creamos la lista ordenada que irá dentro del elemento li del menu
    const container = document.createElement("ul");
    container.classList.add("dropdown-menu");
    container.id = "lista__restaurants";

    // Iteramos sobre las categorias para obtener la informacion que ira en la lista
    for (const restaurant of restaurants) {
      container.insertAdjacentHTML(
        "beforeend",
        `<li><a data-restaurant="${restaurant.name}"
         class="dropdown-item" href="#product-list">${restaurant.name}</a></li>`
      );
    }
    // Al elemento li que irá en el menu le añadimos las menus que acabamos de crear
    li.append(container);
    // Y al menu de navegacion le añadimos li que es donde hemos metido todo
    this.menu.append(li);
  }

  RandomDishes(dishes) {
    // Borramos la zona
    this.dishh.replaceChildren();
    this.preMain.replaceChildren();
    let copiaDishes = [];
    let platosAleatorios = [];
    let numeroPlatos = 3;

    // Si hay mas de un elemento hijo elimina el 2
    if (this.preMain.children.length > 1) this.preMain.children[1].remove();

    const container = document.createElement("div");
    container.classList.add("flex");

    // Añadimos cada plato a la copia
    for (const dish of dishes) {
      copiaDishes.push(dish);
    }
    for (let index = 0; index < numeroPlatos; index++) {
      let indiceAleatorio = Math.floor(Math.random() * copiaDishes.length);
      platosAleatorios.push(copiaDishes[indiceAleatorio]);

      let plato = copiaDishes[indiceAleatorio];

      container.insertAdjacentHTML(
        "beforeend",
        `<div><a data-dish=${
          plato.name
        } href="#product-list"><img class="category-image" alt="${plato.name}" 
        src="${
          "./Multimedia/" + plato.name + ".jpg"
        }" style="max-width: 100%; max-height: 550px;" />  <div>
        <h3>${plato.name}</h3></a></div></div>`
      );

      //Borramos el plato que hemos seleccionado para que no salga de nuevo
      copiaDishes.splice(indiceAleatorio, 1);
    }
    this.preMain.append(container);
  }

  bindCategoryDishesMenu(handler) {
    // Cogemos el elemento de la lista
    let lista = document.getElementById("navCats");
    const links = lista.nextSibling.querySelectorAll("a");

    // Recorremos cada enlace y le añadimos el evento con el que se activira la callback
    for (const li of links) {
      li.addEventListener("click", (event) => {
        // Obtenemos la categoria clickeada
        const { category } = event.currentTarget.dataset;
        this[EXCECUTE_HANDLER](
          handler,
          [category],
          "#product-list",
          { action: "dishCategoryList", category },
          "#product-list",
          event
        );
      });
    }
  }

  bindCategoryDishes(handler) {
    // Cogemos el elemento de la lista
    let lista = document.getElementById("category-list");
    // Cogemos todos los elementos hijos que son los div con clase .category-item
    const links = lista.children;

    // Y ahora recorreremos cada uno de esos elementos y le añadimos un enlace de clickear
    for (const li of links) {
      li.querySelector("a").addEventListener("click", (event) => {
        const { category } = event.currentTarget.dataset;
        this[EXCECUTE_HANDLER](
          handler,
          [category],
          "#product-list",
          { action: "dishCategoryList", category },
          "#product-list",
          event
        );
      });
    }
  }

  bindAllergenDishesMenu(handle) {
    // Cogemos el elemento de la lista
    let lista = document.getElementById("navAllerg");
    // nextSibling pasamos al siguiente hermano y ahi buscamos los elementos a
    const links = lista.nextSibling.querySelectorAll("a");

    // Recorremos cada enlace y le añadimos el evento con el que se activira la callback
    for (const li of links) {
      li.addEventListener("click", (event) => {
        // Obtenemos la categoria clickeada
        const allergen = event.currentTarget.dataset.allergen;
        this[EXCECUTE_HANDLER](
          handle,
          [allergen],
          "#product-list",
          { action: "dishAllergenList", allergen },
          "#product-list",
          event
        );
      });
    }
  }

  bindMenuDishesMenu(handle) {
    // Cogemos el elemento de la lista
    let lista = document.getElementById("navMenus");
    const links = lista.nextSibling.querySelectorAll("a");

    // Recorremos cada enlace y le añadimos el evento con el que se activira la callback
    for (const li of links) {
      li.addEventListener("click", (event) => {
        // Obtenemos la categoria clickeada
        const { menu } = event.currentTarget.dataset;
        this[EXCECUTE_HANDLER](
          handle,
          [menu],
          "#product-list",
          { action: "menuList", menu },
          "#product-list",
          event
        );
      });
    }
  }

  bindRestaurantsDishesMenu(handle) {
    // Cogemos el elemento de la lista
    let lista = document.getElementById("navRest");
    const links = lista.nextSibling.querySelectorAll("a");

    // Recorremos cada enlace y le añadimos el evento con el que se activira la callback
    for (const li of links) {
      li.addEventListener("click", (event) => {
        // Obtenemos la categoria clickeada
        const { restaurant } = event.currentTarget.dataset;
        this[EXCECUTE_HANDLER](
          handle,
          [restaurant],
          "#product-list",
          { action: "restaurantList", restaurant },
          "#product-list",
          event
        );
      });
    }
  }

  // Mostrar plato cuando se le da a una categoria alérgeno o menu
  showDishes(dishes) {
    this.categories.replaceChildren();

    // Si hay más de un elemento hijo, elimina el segundo
    if (this.categories.children.length > 1) {
      this.categories.children[1].remove();
    }

    const container = document.createElement("div");
    container.id = "dish-list";
    container.classList.add("flex");

    for (const dish of dishes) {
      container.insertAdjacentHTML(
        "beforeend",
        `
            <div class="plate-item">
                <a data-dish="${dish.name}" href="#product-list">
                    <div>
                        <img class="category-image plate-image" 
                             style="max-width: 100%; max-height: 550px;" 
                             src="${"./Multimedia/" + dish.name + ".jpg"}" 
                             alt="${dish.name}" />
                    </div>
                    <div>
                        <h3>${dish.name}</h3>
                    </div>
                </a>
            </div>
            `
      );
    }

    this.categories.append(container);
  }

  showRestaurantInformation(restaurant) {
    this.categories.replaceChildren();

    const container = document.createElement("div");
    container.classList.add("flex2");

    container.insertAdjacentHTML(
      "beforeend",
      `<div class = "color">
        <h1> INFORMACION DE ${restaurant.name} </h1> <br>
       <h3> NOMBRE: ${restaurant.name}</h3>
       <h3> ESTILO: ${restaurant.description}</h3>
       <h3> LOCATION: ${restaurant.location}</h3>
     </div>
   </a>
 </div>`
    );
    this.categories.append(container);
  }

  bindShowDish(handle) {
    const div = document.getElementById("dish-list");
    console.log(div);

    // Obtenemos todos los enlaces que son descendientes de los divs hijos del div principal
    const links = div.querySelectorAll("a");

    // Iteramos sobre los enlaces
    for (const li of links) {
      li.addEventListener("click", (event) => {
        // Obtenemos la categoria clickeada
        const { dish } = event.currentTarget.dataset;
        this[EXCECUTE_HANDLER](
          handle,
          [dish],
          "#product-list",
          { action: "dishBind", dish },
          "#product-list",
          event
        );
      });
    }
  }
  dishInformation(dish) {
    this.dishh.replaceChildren();

    this.dishh.insertAdjacentHTML(
      "beforeend",
      `
        <div class="card mx-auto" style="max-width: 9rem;">
            <img src="${
              "./Multimedia/" + dish.name.replace(/\s+/g, "") + ".jpg"
            }" class="card-img-top fotoplato" alt="${dish.name}" >
            <div class="card-body">
                <h5 class="card-title" style="font-size: 1rem;">Nombre: ${
                  dish.name
                }</h5>
                <p class="card-text" style="font-size: 0.9rem;">Descripción: ${
                  dish.description
                }</p>
                <p class="card-text" style="font-size: 0.9rem;">Ingredientes: ${
                  dish.ingredients
                }</p>
                <button class="btn btn-primary" data-dish= ${
                  dish.name
                }>Comprar</button>
                <br> 
                <button id="b-open" class="btn btn-primary" data-dish= ${
                  dish.name
                }>Nueva <br>Ventana</button>
                </div>
            </div>
            
        </div>
        `
    );
  }

  bindShowRandomDish(handle) {
    const div = document.getElementById("platosRandom");
    const links = div.querySelectorAll("a");

    for (const li of links) {
      li.addEventListener("click", (event) => {
        // Obtenemos la categoria clickeada
        const { dish } = event.currentTarget.dataset;
        this[EXCECUTE_HANDLER](
          handle,
          [dish],
          "#product-list",
          { action: "randomDish", dish },
          "#product-list",
          event
        );
      });
    }
  }

  showProductInNewWindow(dish) {
    // Cogemos los elementos de la nueva ventana
    const main = this.dishWindow.document.querySelector("main");
    const header = this.dishWindow.document.querySelector("header nav");

    // Los vaciamos
    main.replaceChildren();
    header.replaceChildren();
    let container;

    // Si existe  el plato
    if (dish) {
      this.dishWindow.document.title = dish.name;
      header.insertAdjacentHTML(
        "beforeend",
        `<h1 dataserial="${dish.name}" class="display-5">${dish.name} -${dish.description}</h1>`
      );
      container = document.createElement("div");
      container.id = "single-product";
      container.classList.add(`${dish.constructor.name}-style`);
      container.classList.add("container");
      container.classList.add("mt-5");
      container.classList.add("mb-5");
      container.insertAdjacentHTML(
        "beforeend",
        `<div class="row d-flex
justify-content-center">
<div class="col-md-10">
<div class="card">
<div class="row">
<div class="col-md-12">
<div class="images p-3">
<div class="text-center p-4"> <img id="main-image"
 src="${"./Multimedia/" + dish.name + ".jpg"}""/> </div>
</div>
</div>
<div class="col-md-12">
<div class="product p-4">
<div class="mt-4 mb-3"> <span class="text-uppercase
text-muted brand">${dish.name}</span>
<h5 class="text-uppercase">${dish.description}</h5>
<div class="price d-flex flex-row align-itemscenter">
<span class="actprice">${dish.ingredients}</span>
</div>
</div>
<p class="about">${dish.description}</p>
<div class="sizes mt-5">
<h6 class="text-uppercase">Características</h6>
</div>
<div class="cart mt-4 align-items-center"> <button
data-serial="${
          dish.name
        }" class="btn btn-primary text-uppercase mr2 px-4">Comprar</button> </div>
</div>
</div>
</div>
</div>
</div>
</div>`
      );
      container.insertAdjacentHTML(
        "beforeend",
        '<button class="btn btnprimary text-uppercase m-2 px-4"onClick="window.close()">Cerrar</button>'
      );
      main.append(container);
    }
  }

  // Método para cuando le demos al botón de abrir en nueva ventana
  bindShowProductInNewWindow(handler) {
    const bOpen = document.getElementById("b-open");

    // Verificamos si la ventana es nula o esta cerrada para abrirla si no lo esta
    bOpen.addEventListener("click", (event) => {
      this.contador++;
      let nombre = "dishWindow" + this.contador;

      this.dishWindow = window.open(
        "Dish.html",
        nombre,
        "width=800, height=600, top=250, left=250, titlebar=yes, toolbar=no, menubar=no, location=no"
      );

      this.ventanas.push(this.dishWindow);

      // Agregamos el evento que se ejecutará cuando el contenido de la ventana emergente se cargue
      this.dishWindow.addEventListener("load", () => {
        handler(event.target.dataset.dish);
      });
    });
  }

  // Método para cerrar ventana
  closeWindow() {
    let botonCerrar = document.getElementById("cerrarVentana"); // Boton cerrar ventana

    botonCerrar.addEventListener("click", () => {
      // Recorremos todas las ventanas para cerrarla
      for (const ventana of this.ventanas) {
        if (ventana || !ventana.closed()) {
          ventana.close();
        }
      }
    });
  }

  showAdminMenu() {
    const menuOption = document.createElement("li");
    menuOption.classList.add("nav-item");
    menuOption.classList.add("dropdown");
    menuOption.insertAdjacentHTML(
      "afterbegin",
      '<a class="nav-link dropdown-toggle" href="#" id="navServices" role="button" data-bs-toggle="dropdown" aria-expanded="false">Adminitración</a>'
    );

    const suboptions = document.createElement("ul");
    suboptions.classList.add("dropdown-menu");
    suboptions.insertAdjacentHTML(
      "beforeend",
      '<li><a id="newDish" class="dropdown-item" href="#newDish">Crear Plato</a></li>'
    );
    suboptions.insertAdjacentHTML(
      "beforeend",
      '<li><a id="removeDish" class="dropdown-item" href="#remove-dish">Eliminar Plato</a></li>'
    );
    suboptions.insertAdjacentHTML(
      "beforeend",
      '<li><a id="assignDish" class="dropdown-item" href="#assignDish">Asignar Platos Menu</a></li>'
    );
    suboptions.insertAdjacentHTML(
      "beforeend",
      '<li><a id="desAssignDish" class="dropdown-item" href="#desAssignDish"> Desasignar Platos Menu</a></li>'
    );
    suboptions.insertAdjacentHTML(
      "beforeend",
      '<li><a id="newCategory" class="dropdown-item" href="#newCategory">Crear Categoria</a></li>'
    );
    suboptions.insertAdjacentHTML(
      "beforeend",
      '<li><a id="deleteCategory" class="dropdown-item" href="#deleteCategory">Borrar Categoria</a></li>'
    );
    suboptions.insertAdjacentHTML(
      "beforeend",
      '<li><a id="newRestaurant" class="dropdown-item" href="#newRestaurant">Crear Restaurante</a></li>'
    );
    suboptions.insertAdjacentHTML(
      "beforeend",
      '<li><a id="modCategoryDish" class="dropdown-item" href="#del-product">Modificar Cateogrias Plato</a></li>'
    );

    menuOption.append(suboptions);
    this.menu.append(menuOption);
  }

  showNewDishForm(categories, allergens) {
    this.categories.replaceChildren();
    this.main.replaceChildren();
    if (this.categories.children.length > 1)
      this.categories.children[1].remove();

    // Creamos el div donde ira nuestro formulario de creacion del plato
    const container = document.createElement("div");

    // Le añadimos las clases y las ids correspondientes a nuestro contenedor
    container.classList.add("container", "my-3");
    container.id = "new-dish";

    // Le añadimos el titulo a nuestro contenedor
    container.insertAdjacentHTML("afterbegin", "<h1>Nuevo Plato</h1>");

    // Añadimos el formulario para la creacion del plato a nuestro contenedor
    container.insertAdjacentHTML(
      "beforeend",
      `     
       <form name="fNewDish" role="form" id="fNewDish" class="booking_frm black"  novalidate> 
         <h2 class="frm_title">Creación Del Plato</>
         
 
         <div class="mt-4">
           <div class="input-group">
             <label for="ndName">Nombre <span class="letter_red">*</span></label>
             <input class="input-style type="text" id="ndName" name="ndName"
             placeholder="Introduzca el nombre del plato" value="" required/>
             <div class="invalid-feedback">El plato debe contener un nombre.</div>
             <div class="valid-feedback">Correcto.</div>
           </div>
         </div>
 
         <div class="mt-4">
           <div class="input-group">
             <label for="ndDescription">Descripción <span class="letter_red">*</span></label>
             <input class="input-style type="text" id="ndDescription" name="ndDescription"
             placeholder="Introduzca la descripcion del plato" value="" required/>
             <div class="invalid-feedback">El plato debe contener una descripción.</div>
             <div class="valid-feedback">Correcto.</div>
           </div>
         </div>
 
         <div class="mt-4">
           <div class="input-group">
             <label for="ndIngredients">Ingredientes <span class="letter_red">*</span></label>
             <input class="input-style type="text" id="ndIngredients" name="ndIngredients"
             placeholder="Introducza los ingredientes (ingre1,ingre2)" pattern="^[a-zA-Z0-9]+(?:,[a-zA-Z0-9]+)*$" value="" required/>
             <div class="invalid-feedback">El plato debe tener ingredientes.</div>
             <div class="valid-feedback">Correcto.</div>
           </div>
         </div>
 
         <div class="mt-4">
           <div class="input-group">
             <label for="ndCategories">Categorias <span class="letter_red">*</span></label>
             <select class="input-style" id="ndCategories" name="ndCategories" size="3" multiple required>
             </select>
             <div class="invalid-feedback">Debe seleccionar al menos una categoria.</div>
             <div class="valid-feedback">Correcto.</div>
           </div>
         </div>
 
         <div class="mt-4">
           <div class="input-group">
             <label for="ndAllergens">Alergenos <span class="letter_red">*</span></label>
             <select class="input-style" id="ndAllergens" name="ndAllergens" size="4" multiple required>
             </select>
             <div class="invalid-feedback">Debe seleccionar al menos un alergeno.</div>
             <div class="valid-feedback">Correcto.</div>
           </div>
         </div>
 
         <div class="mt-4">
           <button class="button red" type="submit">Enviar</button>
           <button class="button red" type="reset">Cancelar</button>
         </div>
       </form>
       `
    );

    // Añadimos el formulario a nuestra pagina
    this.main.append(container);

    // Vamos a poner los alergenos y categorias
    const allergensSelector = document.getElementById("ndAllergens");
    console.log(allergensSelector);

    for (const allergen of allergens) {
      allergensSelector.insertAdjacentHTML(
        "beforeend",
        `
          <option value='${allergen.name}'>${allergen.name}</option>
        `
      );
    }

    // Obtenemos el selector donde iran nuestras categorias
    const categoySelector = document.getElementById("ndCategories");

    // Recorremos las categorias y las añadimos a nuestro selector de categorias
    for (const category of categories) {
      categoySelector.insertAdjacentHTML(
        "beforeend",
        `
          <option value='${category.name}'>${category.name}</option>
        `
      );
    }
  }

  // Formulario para mostrar que plato queremos borrar
  showRemoveDish(categories, allergens) {
    // Primero lo que tenemos que hacer es borrar el contenido del main
    this.categories.replaceChildren();
    this.main.replaceChildren();
    if (this.categories.children.length > 1)
      this.categories.children[1].remove();

    // Creamos el div donde ira nuestro formulario de creacion del plato
    const container = document.createElement("div");

    // Le añadimos las clases y las ids correspondientes a nuestro contenedor
    container.classList.add("container", "my-3");
    container.id = "remove-dish";

    // Le añadimos el titulo a nuestro contenedor
    container.insertAdjacentHTML("afterbegin", "<h1>Eliminar Plato</h1>");

    container.insertAdjacentHTML(
      "beforeend",
      `     
      <form name="fRemoveDish" role="form" id="fRemoveDish" class="booking_frm black"  novalidate> 
        <h2 class="frm_title">Eliminación de platos</>
        <h3 class="frm_subtitle">Rellene los campos con la información necesaria para la eliminacion del plato.</h3>

        <div class="mt-4">
          <div class="input-group">
            <label for="ndCategories">Categoria</label>
            <select class="input-style" id="ndCategories" name="ndCategories">
              <option selected disabled>Seleccione una categoria</option>
            </select>
            <div class="invalid-feedback">Debe seleccionar al menos una categoria.</div>
            <div class="valid-feedback">Correcto.</div>
          </div>
        </div>

        <div class="mt-4">
          <div class="input-group">
            <label for="ndAllergens">Alergenos</label>
            <select class="input-style" id="ndAllergens" name="ndAllergens">
              <option selected disabled>Seleccione un alérgeno</option>
            </select>
            <div class="invalid-feedback">Debe seleccionar al menos un alergeno.</div>
            <div class="valid-feedback">Correcto.</div>
          </div>
        </div>
      </form>
      `
    );
    // Añadimos el contendor donde iran la lista de los platos
    container.insertAdjacentHTML(
      "beforeend",
      '<div id="remove-dishlist" class="container my-3"><div class="row"></div></div>'
    );

    // Añadimos el formulario a nuestra pagina
    this.main.append(container);

    // Obtenemos el selector donde iran nuestro alergenos para añadirlos
    const allergensSelector = document.getElementById("ndAllergens");

    // Recorremos los alergenos que nos llegan
    // y las añadimos a nuestro selector de alergenos
    for (const allergen of allergens) {
      allergensSelector.insertAdjacentHTML(
        "beforeend",
        `
          <option value='${allergen.name}'>${allergen.name}</option>
        `
      );
    }

    // Obtenemos el selector donde iran nuestras categorias
    const categoySelector = document.getElementById("ndCategories");

    // Recorremos las categorias y las añadimos a nuestro selector de categorias
    for (const category of categories) {
      categoySelector.insertAdjacentHTML(
        "beforeend",
        `
          <option value='${category.name}'>${category.name}</option>
        `
      );
    }
  }
  // Mostramos el listado de los productos para eliminarlos
  showRemoveDishList(dishes) {
    // Obtenemos el contenedor donde pondremos nuestros platos
    const dishContainer = document
      .getElementById("remove-dishlist")
      .querySelector("div.row");
    // Remplazamos el contenido de nuestro div
    dishContainer.replaceChildren();

    // Creamos un boolean que nos indicara si existen platos o no
    let existDish = false;

    // Iteramos sobre los platos
    for (const dish of dishes) {
      existDish = true;
      // Añadimos los platos al contenedor
      dishContainer.insertAdjacentHTML(
        "beforeend",
        `
        <div class="card black rounded-3 mr-10 style-card">${dish.name}
            <div class="card-body text-center">
                <p class="card-text text-white">${dish.name}</p>
            </div>
            <div class="mt-4 mb-4 mx-auto">
              <a href='#remove-dish' data-dish="${dish.name}" class="btn justify-content-center button red">Eliminar</a>
            </div>
        </div>
        `
      );
    }

    // Si no existen platos unicamente podremos un mensaje
    if (!existDish) {
      dishContainer.insertAdjacentHTML(
        "beforeend",
        `
          <p class="letter_red">No existen platos para esta categoría o alérgeno</p>
        `
      );
    }
  }

  // Asignaremos un plato al menu
  showAssignDishForm(menus, dishes) {
    // Primero borraremos el contenido del main
    this.categories.replaceChildren();
    this.main.replaceChildren();
    if (this.categories.children.length > 1)
      this.categories.children[1].remove();

    // Creamos el div donde ira nuestro formulario de creacion del plato
    const container = document.createElement("div");

    // Le añadimos las clases y las ids correspondientes a nuestro contenedor
    container.classList.add("container", "my-3");
    container.id = "assign-dish";

    // Le añadimos el titulo a nuestro contenedor
    container.insertAdjacentHTML(
      "afterbegin",
      "<h1>Asignación de plato a menú</h1>"
    );

    // Añadimos el formulario para la creacion del plato a nuestro contenedor
    container.insertAdjacentHTML(
      "beforeend",
      `     
      <form name="fAssignDish" role="form" id="fAssignDish" class="booking_frm black"  novalidate> 
        <h2 class="frm_title">Asignación Del Plato a Menú</>
        <h3 class="frm_subtitle">Rellene los campos con la información necesaria para la asignación del plato.</h3>

        <div class="mt-4">
          <div class="input-group">
            <label for="ndMenus">Menus <span class="letter_red">*</span></label>
            <select class="input-style" id="ndMenus" name="ndMenus"  size="3" required>
            </select>
            <div class="invalid-feedback">Debe seleccionar un menu.</div>
            <div class="valid-feedback">Correcto.</div>
          </div>
        </div>

        <div class="mt-4">
          <div class="input-group">
            <label for="ndDishes">Platos <span class="letter_red">*</span></label>
            <select class="input-style" id="ndDishes" name="ndDishes" size="4" multiple required>
            </select>
            <div class="invalid-feedback">Debe seleccionar al menos un plato.</div>
            <div class="valid-feedback">Correcto.</div>
          </div>
        </div>

        <div class="mt-4">
          <button class="button red" type="submit">Enviar</button>
          <button class="button red" type="reset">Cancelar</button>
        </div>
      </form>
      `
    );

    // Añadimos el formulario a nuestra pagina
    this.main.append(container);

    const menuSelector = document.getElementById("ndMenus");

    // Recorremos los menus que nos llegan
    // y las añadimos a nuestro selector de menus
    for (const menu of menus) {
      menuSelector.insertAdjacentHTML(
        "beforeend",
        `
           <option value='${menu.name}'>${menu.name}</option>
         `
      );
    }
    // Obtenemos el selector donde iran nuestro menus
    const dishesSelector = document.getElementById("ndDishes");

    // Recorremos los menus que nos llegan
    // y las añadimos a nuestro selector de menus
    for (const dish of dishes) {
      dishesSelector.insertAdjacentHTML(
        "beforeend",
        `
             <option value='${dish.name}'>${dish.name}</option>
           `
      );
    }
  }

  showDesAssignDishForm(menus, dishes) {
    // Primero borraremos el contenido del main
    this.categories.replaceChildren();
    this.main.replaceChildren();
    if (this.categories.children.length > 1)
      this.categories.children[1].remove();

    // Creamos el div donde ira nuestro formulario de creacion del plato
    const container = document.createElement("div");

    // Le añadimos las clases y las ids correspondientes a nuestro contenedor
    container.classList.add("container", "my-3");
    container.id = "desassign-dish";

    // Le añadimos el titulo a nuestro contenedor
    container.insertAdjacentHTML(
      "afterbegin",
      "<h1>Desasignación de plato a menú</h1>"
    );

    // Añadimos el formulario para la creacion del plato a nuestro contenedor
    container.insertAdjacentHTML(
      "beforeend",
      `     
      <form name="fDesAssignDish" role="form" id="fDesAssignDish" class="booking_frm black"  novalidate> 
        <h2 class="frm_title">Desasignación plato al menú</>
        <h3 class="frm_subtitle">Rellene los campos con la información necesaria para la desasignación del plato.</h3>

        <div class="mt-4">
          <div class="input-group">
            <label for="ndMenus">Menus <span class="letter_red">*</span></label>
            <select class="input-style" id="ndMenus" name="ndMenus"  size="3" required>
            </select>
            <div class="invalid-feedback">Debe seleccionar un menu.</div>
            <div class="valid-feedback">Correcto.</div>
          </div>
        </div>

        <div class="mt-4">
          <div class="input-group">
            <label for="ndDishes">Platos <span class="letter_red">*</span></label>
            <select class="input-style" id="ndDishes" name="ndDishes" size="4" multiple required>
            </select>
            <div class="invalid-feedback">Debe seleccionar al menos un plato.</div>
            <div class="valid-feedback">Correcto.</div>
          </div>
        </div>

        <div class="mt-4">
          <button class="button red" type="submit">Enviar</button>
          <button class="button red" type="reset">Cancelar</button>
        </div>
      </form>
      `
    );

    // Añadimos el formulario a nuestra pagina
    this.main.append(container);

    // Obtenemos el selector donde iran nuestro menus
    const menuSelector = document.getElementById("ndMenus");

    // Recorremos los menus que nos llegan
    // y las añadimos a nuestro selector de menus
    for (const menu of menus) {
      menuSelector.insertAdjacentHTML(
        "beforeend",
        `
            <option value='${menu.name}'>${menu.name}</option>
          `
      );
    }

    // Obtenemos el selector donde iran nuestro menus
    const dishesSelector = document.getElementById("ndDishes");

    // Recorremos los menus que nos llegan
    // y las añadimos a nuestro selector de menus
    for (const dish of dishes) {
      dishesSelector.insertAdjacentHTML(
        "beforeend",
        `
             <option value='${dish.name}'>${dish.name}</option>
           `
      );
    }
  }

  showNewCategoryForm() {
    // Primero borraremos el contenido del main
    this.categories.replaceChildren();
    this.main.replaceChildren();
    if (this.categories.children.length > 1)
      this.categories.children[1].remove();

    // Creamos el div donde ira nuestro formulario de creacion del plato
    const container = document.createElement("div");

    // Le añadimos las clases y las ids correspondientes a nuestro contenedor
    container.classList.add("container", "my-3");
    container.id = "new-category";

    // Le añadimos el titulo a nuestro contenedor
    container.insertAdjacentHTML("afterbegin", "<h1>Nuevo Categoria</h1>");

    // Añadimos el formulario para la creacion del plato a nuestro contenedor
    container.insertAdjacentHTML(
      "beforeend",
      `     
      <form name="fNewCategory" role="form" id="fNewCategory" class="booking_frm black"  novalidate> 
        <h2 class="frm_title">Creación Categoria</>
        <h3 class="frm_subtitle">Rellene los campos con la información necesaria para la creación de la categoria.</h3>

        <div class="mt-4">
          <div class="input-group">
            <label for="ndCategoryName">Nombre <span class="letter_red">*</span></label>
            <input class="input-style type="text" id="ndCategoryName" name="ndCategoryName"
            placeholder="Introduzca el nombre de la categoria" value="" required/>
            <div class="invalid-feedback">La categoria debe contener un nombre.</div>
            <div class="valid-feedback">Correcto.</div>
          </div>
        </div>

        <div class="mt-4">
          <div class="input-group">
            <label for="ndCategoryDescription">Descripción <span class="letter_red">*</span></label>
            <input class="input-style type="text" id="ndCategoryDescription" name="ndCategoryDescription"
            placeholder="Introduzca la descripcion de la categoria" value="" required/>
            <div class="invalid-feedback">La categoria debe contener una descripción.</div>
            <div class="valid-feedback">Correcto.</div>
          </div>
        </div>

        <div class="mt-4">
          <button class="button red" type="submit">Enviar</button>
          <button class="button red" type="reset">Cancelar</button>
        </div>
      </form>
      `
    );
    this.main.append(container);
  }

  // Metodo con el que eliminaremos nuestras categorias
  showRemoveCategoryForm(categories) {
    // Primero borraremos el contenido del main
    this.categories.replaceChildren();
    this.main.replaceChildren();
    if (this.categories.children.length > 1)
      this.categories.children[1].remove();

    // Creamos el div donde ira nuestro formulario de creacion del plato
    const container = document.createElement("div");

    // Le añadimos las clases y las ids correspondientes a nuestro contenedor
    container.classList.add("container", "my-3", "row");
    container.id = "del-category";

    // Le añadimos el titulo a nuestro contenedor
    container.insertAdjacentHTML(
      "afterbegin",
      "<h1>Eliminacion de categoria</h1>"
    );

    for (const category of categories) {
      // Añadimos las categorias a nuestro contenedor
      container.insertAdjacentHTML(
        "beforeend",
        `     
          <div class="card black rounded-3 mt-20 style-card">${category.name}
            <div class="card-body text-center">
                <p class="card-text text-white">${category.name}</p>
            </div>
            <div class="mx-auto mt-4 mb-4 fs-6">
              <a  href='#' class="btn button red" data-category="${category.name}" type="button">
                Eliminar
              </a>
            </div>
          </div>
        `
      );
    }

    // Añadimos el formulario a nuestra pagina
    this.main.append(container);
  }

  showNewRestaurantForm() {
    // Primero borraremos el contenido del main
    this.categories.replaceChildren();
    this.main.replaceChildren();
    if (this.categories.children.length > 1)
      this.categories.children[1].remove();

    // Creamos el div donde ira nuestro formulario de creacion del plato
    const container = document.createElement("div");

    // Le añadimos las clases y las ids correspondientes a nuestro contenedor
    container.classList.add("container", "my-3");
    container.id = "new-restaurant";

    // Le añadimos el titulo a nuestro contenedor
    container.insertAdjacentHTML("afterbegin", "<h1>Nuevo Restaurante</h1>");

    // Añadimos el formulario para la creacion del plato a nuestro contenedor
    container.insertAdjacentHTML(
      "beforeend",
      `     
      <form name="fNewRestaurant" role="form" id="fNewRestaurant" class="booking_frm black" novalidate> 
        <h2 class="frm_title">Creación Restaurante</>
        <h3 class="frm_subtitle">Rellene los campos con la información necesaria para la creación del restaurante.</h3>

        <div class="mt-4">
          <div class="input-group">
            <label for="ndResName">Nombre <span class="letter_red">*</span></label>
            <input class="input-style type="text" id="ndResName" name="ndResName"
            placeholder="Introduzca el nombre del restaurante" value="" required/>
            <div class="invalid-feedback">El restaurante debe contener un nombre.</div>
            <div class="valid-feedback">Correcto.</div>
          </div>
        </div>

        <div class="mt-4">
          <div class="input-group">
            <label for="ndResDescription">Descripción <span class="letter_red">*</span></label>
            <input class="input-style type="text" id="ndResDescription" name="ndResDescription"
            placeholder="Introduzca la descripcion del restaurante" value="" required/>
            <div class="invalid-feedback">El restaurante debe contener una descripción.</div>
            <div class="valid-feedback">Correcto.</div>
          </div>
        </div>

        <div class="mt-4">
          <button class="button red" type="submit">Enviar</button>
          <button class="button red" type="reset">Cancelar</button>
        </div>
      </form>
      `
    );

    // Añadimos el formulario a nuestra pagina
    this.main.append(container);
  }

  bindAdminMenu(
    newDish,
    removeDish,
    assignDish,
    desssingDish,
    newCategory,
    deleteCat,
    newRestaurant
  ) {
    const newDishLink = document.getElementById("newDish");
    newDishLink.addEventListener("click", (event) => {
      this[EXCECUTE_HANDLER](
        newDish,
        [],
        "#newDish",
        { action: "newDish" },
        "#",
        event
      );
    });

    const removeDishLink = document.getElementById("removeDish");
    removeDishLink.addEventListener("click", (event) => {
      this[EXCECUTE_HANDLER](
        removeDish,
        [],
        "#remove-dish",
        { action: "removeDish" },
        "#",
        event
      );
    });

    const assignDishLink = document.getElementById("assignDish");
    assignDishLink.addEventListener("click", (event) => {
      this[EXCECUTE_HANDLER](
        assignDish,
        [],
        "#assignDish",
        { action: "assignDish" },
        "#",
        event
      );
    });

    const deassignDishLink = document.getElementById("desAssignDish");
    deassignDishLink.addEventListener("click", (event) => {
      this[EXCECUTE_HANDLER](
        desssingDish,
        [],
        "#desAssignDish",
        { action: "desAssignDish" },
        "#",
        event
      );
    });

    const createCategory = document.getElementById("newCategory");
    createCategory.addEventListener("click", (event) => {
      this[EXCECUTE_HANDLER](
        newCategory,
        [],
        "#newCategory",
        { action: "newCategory" },
        "#",
        event
      );
    });

    const deleteCategory = document.getElementById("deleteCategory");
    deleteCategory.addEventListener("click", (event) => {
      this[EXCECUTE_HANDLER](
        deleteCat,
        [],
        "#deleteCategory",
        { action: "deleteCategory" },
        "#",
        event
      );
    });

    const createRestaurant = document.getElementById("newRestaurant");
    createRestaurant.addEventListener("click", (event) => {
      this[EXCECUTE_HANDLER](
        newRestaurant,
        [],
        "#newRestaurant",
        { action: "newRestaurant" },
        "#",
        event
      );
    });
  }

  // Este bind se activará cuuando seleccionemos en un select de un formulario
  bindRemoveDishSelect(allergens, categories) {
    // Recogemos el select de alergenos
    const ndAllergens = document.getElementById("ndAllergens");
    ndAllergens.addEventListener("change", (event) => {
      this[EXCECUTE_HANDLER](
        allergens,
        [event.currentTarget.value],
        "#remove-dish",
        { action: "removeDishByAllergen", allergen: event.currentTarget.value },
        "#remove-dish",
        event
      );
    });

    // Recogemos el select de categorias
    const ndCategories = document.getElementById("ndCategories");
    ndCategories.addEventListener("change", (event) => {
      this[EXCECUTE_HANDLER](
        categories,
        [event.currentTarget.value],
        "#remove-dish",
        { action: "removeDishByCategory", category: event.currentTarget.value },
        "#remove-dish",
        event
      );
    });
  }

  // Bind para la eliminacion de platos
  bindRemoveDish(handler) {
    // Recogemos el contenedor donde tenemos los platos
    const dishList = document.getElementById("remove-dish");
    // Recogemos los botones de eliminar
    const buttons = dishList.querySelectorAll("a");
    // Iteramos sobre los botones
    for (const button of buttons) {
      button.addEventListener("click", function (event) {
        handler(this.dataset.dish);
      });
    }
  }

  // Vinculamos el manejador a los botones de eliminar de las categorias
  bindRemoveCategoryForm(handler) {
    const container = document.getElementById("del-category");
    const buttons = container.getElementsByTagName("a");
    for (const button of buttons) {
      button.addEventListener("click", function (event) {
        handler(this.dataset.category);
      });
    }
  }

  bindNewDishForm(handler) {
    newDishValidation(handler);
  }

  bindAssignDishForm(handler) {
    assignValidationForm(handler);
  }

  bindDesAssignDishForm(handler) {
    desAssignValidationForm(handler);
  }

  bindNewCategoryForm(handler) {
    newCategoryValidationForm(handler);
  }

  bindNewRestauranForm(handler) {
    newRestaurantValidationForm(handler);
  }

  // MODALES

  showDishModal(done, dish, error) {
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");

    const title = document.getElementById("messageModalTitle");
    title.innerHTML = "Plato creada";
    const body = messageModalContainer.querySelector(".modal-body");
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="p-3">El plato <strong>${dish.name}</strong> ha sido creado correctamente.</div>`
      );
    } else {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> El plato <strong>${dish.name}</strong> se ha creado correctamente.</div>`
      );
    }
    messageModal.show();
    const listener = (event) => {
      if (done) {
        document.fNewDish.reset();
      }
      document.fNewDish.ndName.focus();
      messageModalContainer.addEventListener("hidden.bs.modal", listener, {
        once: true,
      });
    };
  }
  showRemoveDishModal(done, dish, error) {
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");

    const title = document.getElementById("messageModalTitle");
    title.innerHTML = "Plato eliminado";
    const body = messageModalContainer.querySelector(".modal-body");
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="p-3">El plato <strong>${dish.name}</strong> ha sido eliminado correctamente.</div>`
      );
    } else {
      body.insertAdjacentHTML(
        "afterbegin",
        '<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> El plato no existe en el manager.</div>'
      );
    }
    messageModal.show();
  }

  showAssignDishModal(done, menu, error) {
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");

    const title = document.getElementById("messageModalTitle");
    title.innerHTML = "Asignación plato menu";
    const body = messageModalContainer.querySelector(".modal-body");
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="p-3">Los platos han sido agregados al <strong>${menu.name}</strong>.</div>`
      );
    } else {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i>El <strong>${menu.name}</strong> ya contiene alguno de los platos que esta intentando agregar.</div>`
      );
    }
    messageModal.show();
    const listener = (event) => {
      if (done) {
        document.fAssignDish.reset();
      }
      document.fAssignDish.ndMenus.focus();
    };
    messageModalContainer.addEventListener("hidden.bs.modal", listener, {
      once: true,
    });
  }

  showDesAssignDishModal(done, menu, error) {
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");

    const title = document.getElementById("messageModalTitle");
    title.innerHTML = "Desasignación plato menu";
    const body = messageModalContainer.querySelector(".modal-body");
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="p-3">Los platos han sido desasignados del <strong>${menu.name}</strong>.</div>`
      );
    } else {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i>El <strong>${menu.name}</strong> no contiene alguno de los platos seleccionados.</div>`
      );
    }
    messageModal.show();
    const listener = (event) => {
      if (done) {
        document.fDesAssignDish.reset();
      }
      document.fDesAssignDish.ndMenus.focus();
    };
    messageModalContainer.addEventListener("hidden.bs.modal", listener, {
      once: true,
    });
  }

  showRemoveDishModal(done, dish, error) {
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");

    const title = document.getElementById("messageModalTitle");
    title.innerHTML = "Plato eliminado";
    const body = messageModalContainer.querySelector(".modal-body");
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="p-3">El plato <strong>${dish.name}</strong> ha sido eliminado correctamente.</div>`
      );
    } else {
      body.insertAdjacentHTML(
        "afterbegin",
        '<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> El plato no existe en el manager.</div>'
      );
    }
    messageModal.show();
  }

  showNewCategoryModal(done, cate, error) {
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");

    const title = document.getElementById("messageModalTitle");
    title.innerHTML = "Categoria creada";
    const body = messageModalContainer.querySelector(".modal-body");
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="p-3">La categoria <strong>${cate.name}</strong> ha sido creada correctamente.</div>`
      );
    } else {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> La categoria <strong>${cate.name}</strong> no ha podido crearse correctamente.</div>`
      );
    }
    messageModal.show();
    const listener = (event) => {
      if (done) {
        document.fNewCategory.reset();
      }
      document.fNewCategory.ndCategoryName.focus();
    };
    messageModalContainer.addEventListener("hidden.bs.modal", listener, {
      once: true,
    });
  }
  showRemoveCategoryModal(done, cat, error) {
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");

    const title = document.getElementById("messageModalTitle");
    title.innerHTML = "Categoria eliminada";
    const body = messageModalContainer.querySelector(".modal-body");
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="p-3">La categoria <strong>${cat.name}</strong> ha sido eliminado correctamente.</div>`
      );
    } else {
      body.insertAdjacentHTML(
        "afterbegin",
        '<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> La categoria no existe en el manager.</div>'
      );
    }
    messageModal.show();
  }
  showNewRestaurantModal(done, res, error) {
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");

    const title = document.getElementById("messageModalTitle");
    title.innerHTML = "Restaurante creado";
    const body = messageModalContainer.querySelector(".modal-body");
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="p-3">El restaurante <strong>${res.name}</strong> ha sido creada correctamente.</div>`
      );
    } else {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i>El restaurante <strong>${res.name}</strong> no ha podido crearse correctamente.</div>`
      );
    }
    messageModal.show();
    const listener = (event) => {
      if (done) {
        document.fNewRestaurant.reset();
      }
      document.fNewRestaurant.ndResName.focus();
    };
    messageModalContainer.addEventListener("hidden.bs.modal", listener, {
      once: true,
    });
  }

  // Metodo para mostrar el mensaje de la cookie
  showCookiesMessage() {
    const toast = `<div class="fixed-top p-5 mt-5">
			<div id="cookies-message" class="toast fade show bg-dark text-white w-100 mw-100" role="alert" aria-live="assertive" aria-atomic="true">
				<div class="toast-header">
					<h4 class="me-auto">Aviso de uso de cookies</h4>
					<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close" id="btnDismissCookie"></button>
				</div>
				<div class="toast-body p-4 d-flex flex-column">
					<p>
						Este sitio web almacenda datos en cookies para activar su funcionalidad, entre las que se encuentra
						datos analíticos y personalización. Para poder utilizar este sitio, estás automáticamente aceptando
						que
						utilizamos cookies.
					</p>
					<div class="ml-auto">
						<button type="button" class="btn btn-outline-light mr-3 deny" id="btnDenyCookie" data-bs-dismiss="toast">
							Denegar
						</button>
						<button type="button" class="btn btn-primary" id="btnAcceptCookie" data-bs-dismiss="toast">
							Aceptar
						</button>
					</div>
				</div>
			</div>
		</div>`;
    document.body.insertAdjacentHTML("afterbegin", toast);

    const cookiesMessage = document.getElementById("cookies-message");
    cookiesMessage.addEventListener("hidden.bs.toast", (event) => {
      event.currentTarget.parentElement.remove();
    });

    const btnAcceptCookie = document.getElementById("btnAcceptCookie");
    btnAcceptCookie.addEventListener("click", (event) => {
      setCookie("accetedCookieMessage", "true", 1);
    });

    const denyCookieFunction = (event) => {
      this.main.replaceChildren();
      this.main.insertAdjacentHTML(
        "afterbegin",
        `<div class="container my-3"><div class="alert alert-warning" role="alert">
					<strong>Para utilizar esta web es necesario aceptar el uso de cookies. Debe recargar la página y aceptar las condicones para seguir navegando. Gracias.</strong>
				</div></div>`
      );
      this.categories.remove();
      this.menu.remove();
    };
    const btnDenyCookie = document.getElementById("btnDenyCookie");
    btnDenyCookie.addEventListener("click", denyCookieFunction);
    const btnDismissCookie = document.getElementById("btnDismissCookie");
    btnDismissCookie.addEventListener("click", denyCookieFunction);
  }

  initHistory() {
    history.replaceState({ action: "init" }, null);
  }

  deleteUserCookie() {
    setCookie("activeUser", "", 0);
  }

  showIdentificationLink() {
    const userArea = document.getElementById("userArea");
    userArea.replaceChildren();
    userArea.insertAdjacentHTML(
      "afterbegin",
      `<div class="account d-flex mx-2 flex-column" style="text-align: right; height: 40px">
			<a id="login" href="#"><i class="bi bi-person-circle" aria-hidden="true"></i> Identificate</a>
		</div>`
    );
  }

  bindIdentificationLink(handler) {
    const login = document.getElementById("login");
    login.addEventListener("click", (event) => {
      this[EXCECUTE_HANDLER](
        handler,
        [],
        "main",
        { action: "login" },
        "#",
        event
      );
    });
  }

  bindLogin(handler) {
    const form = document.forms.fLogin;
    form.addEventListener("submit", (event) => {
      handler(form.username.value, form.password.value, form.remember.checked);
      event.preventDefault();
    });
  }

  showLogin() {
    this.main.replaceChildren();
    const login = `<div class="container h-100" style="height: 20vh;">
    <div class="d-flex justify-content-center h-100" style="height: 40vh; margin-top: 50px;">
    <div class="user_card" style='height: 80%;'>
            <div class="d-flex justify-content-center form_container" style='height: 60%;'>
                <form name="fLogin" role="form" novalidate>
                    <div class="input-group mb-3">
                        <div class="input-group-append">
                            <span class="input-group-text"><i class="bi bi-person-circle"></i></span>
                        </div>
                        <input type="text" name="username" class="form-control input_user" value="" placeholder="usuario">
                    </div>
                    <div class="input-group mb-2">
                        <div class="input-group-append">
                            <span class="input-group-text"><i class="bi bi-key-fill"></i></span>
                        </div>
                        <input type="password" name="password" class="form-control input_pass" value="" placeholder="contraseña">
                    </div>
                    <div class="form-group">
                        <div class="custom-control custom-checkbox">
                            <input name="remember" type="checkbox" class="custom-control-input" id="customControlInline">
                            <label class="custom-control-label" for="customControlInline">Recuerdame</label>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center mt-3 login_container">
                        <button class="btn login_btn" type="submit">Acceder</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
`;
    this.main.insertAdjacentHTML("afterbegin", login);
  }

  showInvalidUserMessage() {
    this.main.insertAdjacentHTML(
      "beforeend",
      `<div class="container my-3"><div class="alert alert-warning" role="alert">
		<strong>El usuario y la contraseña no son válidos. Inténtelo nuevamente.</strong>
	</div></div>`
    );
    document.forms.fLogin.reset();
    document.forms.fLogin.username.focus();
    alert("El usuario y la contraseña no son válidos. Inténtelo nuevamente");
  }

  showAuthUserProfile(user) {
    const userArea = document.getElementById("userArea");
    userArea.replaceChildren();
    userArea.insertAdjacentHTML(
      "afterbegin",
      `<div class="account d-flex mx-2 flex-column" style="text-align: right">
				${user.username} <a id="aCloseSession" href="#">Cerrar sesión</a>
			</div>`
    );
  }
  setUserCookie(user) {
    setCookie("activeUser", user.username, 1);
  }

  removeAdminMenu() {
    const adminMenu = document.getElementById("navServices");
    if (adminMenu) adminMenu.parentElement.remove();
  }
  bindCloseSession(handler) {
    document
      .getElementById("aCloseSession")
      .addEventListener("click", (event) => {
        handler();
        event.preventDefault();
      });
  }
}

export default RestaurantView;
