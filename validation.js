// Script que creamos para submit y validación del formulario

// Funcion con la que mostraremos le feedback al usuario, es decir indica si es valido o no un campo del formulario que le hemos pasado
function showFeedBack(input, valid, message) {
  const validClass = valid ? "is-valid" : "is-invalid";
  const messageDiv = valid
    ? input.parentElement.querySelector("div.valid-feedback")
    : input.parentElement.querySelector("div.invalid-feedback");
  for (const div of input.parentElement.getElementsByTagName("div")) {
    div.classList.remove("d-block");
  }
  messageDiv.classList.remove("d-none");
  messageDiv.classList.add("d-block");
  input.classList.remove("is-valid");
  input.classList.remove("is-invalid");
  input.classList.add(validClass);
  if (message) {
    messageDiv.innerHTML = message;
  }
}

function defaultCheckElement(event) {
  this.value = this.value.trim();
  if (!this.checkValidity()) {
    showFeedBack(this, false);
  } else {
    showFeedBack(this, true);
  }
}

// Creamos el metodo con el que validaremos el plato del formualario
export function newDishValidation(handler) {
  // Obtenemos el formulario que vamos a validar
  const form = document.forms.fNewDish;

  form.setAttribute("novalidate", true);

  // Evento para cuando pulsemos el boton de enviar en el formulario seleccionado
  // validamos todos los datos
  form.addEventListener("submit", function (event) {
    // Creamos las variables necesarias

    let isValid = true; // Variable booleana donde indicaremos si los valores son validos
    let firstInvalidElement = null;

    // EL THIS VA A SER EL EVENTO

    // Validamos el nombre
    if (!this.ndName.checkValidity()) {
      isValid = false;
      showFeedBack(this.ndName, false);
      firstInvalidElement = this.ndName;
    } else {
      showFeedBack(this.ndName, true);
    }

    // Validamos la descripcion
    if (!this.ndDescription.checkValidity()) {
      isValid = false;
      showFeedBack(this.ndDescription, false);
      firstInvalidElement = this.ndDescription;
    } else {
      showFeedBack(this.ndDescription, true);
    }

    // Validamos el string de ingredientes
    if (!this.ndIngredients.checkValidity()) {
      isValid = false;
      showFeedBack(this.ndIngredients, false);
      firstInvalidElement = this.ndIngredients;
    } else {
      showFeedBack(this.ndIngredients, true);
    }

    // Validamos que haya al menos una categoria seleccionada
    if (!this.ndCategories.checkValidity()) {
      isValid = false;
      showFeedBack(this.ndCategories, false);
      firstInvalidElement = this.ndCategories;
    } else {
      showFeedBack(this.ndCategories, true);
    }

    // Validamos que haya al menos un alergeno seleccionado
    if (!this.ndAllergens.checkValidity()) {
      isValid = false;
      showFeedBack(this.ndAllergens, false);
      firstInvalidElement = this.ndAllergens;
    } else {
      showFeedBack(this.ndAllergens, true);
    }

    if (!isValid) {
      firstInvalidElement.focus();
    } else {
      // Recogemos las categorias seleccionadas y las pasamos a map
      const categories = [...this.ndCategories.selectedOptions].map(
        (option) => option.value
      );

      // Recogemos los alergenos seleccionados y los pasamos a map
      const allergens = [...this.ndAllergens.selectedOptions].map(
        (option) => option.value
      );

      // Le pasamos a nuestro handler todos los valores para la creacion del plato

      //AQUI SI QUE LLEGA, Y HACE UN CONSOLE LOG DE TODO
      console.log(this.ndName.value);
      console.log(this.ndDescription.value);
      console.log(this.ndIngredients.value);

      handler(
        this.ndName.value,
        this.ndDescription.value,
        this.ndIngredients.value,
        categories,
        allergens
      );
    }

    // Quitamos los valores por defecto
    event.preventDefault();
    event.stopPropagation();
  });

  // Evento para cuando pulsemos el boton de cancelar
  form.addEventListener("reset", function (event) {
    for (const div of this.querySelectorAll(
      "div.valid-feedback, div.invalid-feedback"
    )) {
      div.classList.remove("d-block");
      div.classList.add("d-none");
    }
    for (const input of this.querySelectorAll("input")) {
      input.classList.remove("is-valid");
      input.classList.remove("is-invalid");
    }
    this.ndName.focus();
  });

  form.ndName.addEventListener("change", defaultCheckElement);
  form.ndDescription.addEventListener("change", defaultCheckElement);
  form.ndIngredients.addEventListener("change", defaultCheckElement);
}

export function assignValidationForm(handler) {
  // Obtenemos el formulario que vamos a validar
  const form = document.forms.fAssignDish;
  form.setAttribute("novalidate", true);

  // Evento para cuando pulsemos el boton de enviar
  // realizamos la validadcion de todos los datos
  form.addEventListener("submit", function (event) {
    // Creamos las variables necesarias
    let isValid = true; // Variable booleana donde indicaremos si los valores son validos
    let firstInvalidElement = null;

    // Validamos que se haya seleccionado un menu
    if (!this.ndMenus.checkValidity()) {
      isValid = false;
      showFeedBack(this.ndMenus, false);
      firstInvalidElement = this.ndMenus;
    } else {
      showFeedBack(this.ndMenus, true);
    }

    // Validamos que se haya seleccionado un plato
    if (!this.ndDishes.checkValidity()) {
      isValid = false;
      showFeedBack(this.ndDishes, false);
      firstInvalidElement = this.ndDishes;
    } else {
      showFeedBack(this.ndDishes, true);
    }

    if (!isValid) {
      firstInvalidElement.focus();
    } else {
      // Recogemos los platos seleccionados
      const dishes = [...this.ndDishes.selectedOptions].map(
        (option) => option.value
      );

      // Le pasamos a nuestro handler todos los valores para la creacion del plato
      handler(this.ndMenus.value, dishes);
    }

    // Quitamos los valores por defecto
    event.preventDefault();
    event.stopPropagation();
  });

  // Evento para cuando pulsemos el boton de cancelar
  form.addEventListener("reset", function (event) {
    for (const div of this.querySelectorAll(
      "div.valid-feedback, div.invalid-feedback"
    )) {
      div.classList.remove("d-block");
      div.classList.add("d-none");
    }
    for (const input of this.querySelectorAll("input")) {
      input.classList.remove("is-valid");
      input.classList.remove("is-invalid");
    }
    this.ndMenus.focus();
  });
}

export function desAssignValidationForm(handler) {
  // Obtenemos el formulario que vamos a validar
  const form = document.forms.fDesAssignDish;
  form.setAttribute("novalidate", true);

  // Evento para cuando pulsemos el boton de enviar
  // realizamos la validadcion de todos los datos
  form.addEventListener("submit", function (event) {
    // Creamos las variables necesarias
    let isValid = true; // Variable booleana donde indicaremos si los valores son validos
    let firstInvalidElement = null;

    // Validamos que se haya seleccionado un menu
    if (!this.ndMenus.checkValidity()) {
      isValid = false;
      showFeedBack(this.ndMenus, false);
      firstInvalidElement = this.ndMenus;
    } else {
      showFeedBack(this.ndMenus, true);
    }

    // Validamos que se haya seleccionado un plato
    if (!this.ndDishes.checkValidity()) {
      isValid = false;
      showFeedBack(this.ndDishes, false);
      firstInvalidElement = this.ndDishes;
    } else {
      showFeedBack(this.ndDishes, true);
    }

    if (!isValid) {
      firstInvalidElement.focus();
    } else {
      // Recogemos los platos seleccionados
      const dishes = [...this.ndDishes.selectedOptions].map(
        (option) => option.value
      );

      // Le pasamos a nuestro handler todos los valores para la creacion del plato
      handler(this.ndMenus.value, dishes);
    }

    // Quitamos los valores por defecto
    event.preventDefault();
    event.stopPropagation();
  });

  // Evento para cuando pulsemos el boton de cancelar
  form.addEventListener("reset", function (event) {
    for (const div of this.querySelectorAll(
      "div.valid-feedback, div.invalid-feedback"
    )) {
      div.classList.remove("d-block");
      div.classList.add("d-none");
    }
    for (const input of this.querySelectorAll("input")) {
      input.classList.remove("is-valid");
      input.classList.remove("is-invalid");
    }
    this.ndMenus.focus();
  });
}

// Creamos el metodo con el que validaremos la categoria del formualario
export function newCategoryValidationForm(handler) {
  // Obtenemos el formulario que vamos a validar
  const form = document.forms.fNewCategory;
  form.setAttribute("novalidate", true);

  // Evento para cuando pulsemos el boton de enviar
  // realizamos la validadcion de todos los datos
  form.addEventListener("submit", function (event) {
    // Creamos las variables necesarias
    let isValid = true; // Variable booleana donde indicaremos si los valores son validos
    let firstInvalidElement = null;

    // Validamos el nombre
    if (!this.ndCategoryName.checkValidity()) {
      isValid = false;
      showFeedBack(this.ndCategoryName, false);
      firstInvalidElement = this.ndCategoryName;
    } else {
      showFeedBack(this.ndCategoryName, true);
    }

    // Validamos la descripcion
    if (!this.ndCategoryDescription.checkValidity()) {
      isValid = false;
      showFeedBack(this.ndCategoryDescription, false);
      firstInvalidElement = this.ndCategoryDescription;
    } else {
      showFeedBack(this.ndCategoryDescription, true);
    }

    if (!isValid) {
      firstInvalidElement.focus();
    } else {
      // Le pasamos a nuestro handler todos los valores para la creacion del plato
      handler(this.ndCategoryName.value, this.ndCategoryDescription.value);
    }

    // Quitamos los valores por defecto
    event.preventDefault();
    event.stopPropagation();
  });

  // Evento para cuando pulsemos el boton de cancelar
  form.addEventListener("reset", function (event) {
    for (const div of this.querySelectorAll(
      "div.valid-feedback, div.invalid-feedback"
    )) {
      div.classList.remove("d-block");
      div.classList.add("d-none");
    }
    for (const input of this.querySelectorAll("input")) {
      input.classList.remove("is-valid");
      input.classList.remove("is-invalid");
    }
    this.ndCategoryName.focus();
  });

  form.ndCategoryName.addEventListener("change", defaultCheckElement);
  form.ndCategoryDescription.addEventListener("change", defaultCheckElement);
}

// Creamos el metodo con el que validaremos el restaurante del formualario
export function newRestaurantValidationForm(handler) {
  // Obtenemos el formulario que vamos a validar
  const form = document.forms.fNewRestaurant;
  form.setAttribute("novalidate", true);

  // Evento para cuando pulsemos el boton de enviar
  // realizamos la validadcion de todos los datos
  form.addEventListener("submit", function (event) {
    // Creamos las variables necesarias
    let isValid = true; // Variable booleana donde indicaremos si los valores son validos
    let firstInvalidElement = null;

    // Validamos el nombre
    if (!this.ndResName.checkValidity()) {
      isValid = false;
      showFeedBack(this.ndResName, false);
      firstInvalidElement = this.ndResName;
    } else {
      showFeedBack(this.ndResName, true);
    }

    // Validamos la descripcion
    if (!this.ndResDescription.checkValidity()) {
      isValid = false;
      showFeedBack(this.ndResDescription, false);
      firstInvalidElement = this.ndResDescription;
    } else {
      showFeedBack(this.ndResDescription, true);
    }

    if (!isValid) {
      firstInvalidElement.focus();
    } else {
      // Le pasamos a nuestro handler todos los valores para la creacion del plato
      handler(this.ndResName.value, this.ndResDescription.value);
    }

    // Quitamos los valores por defecto
    event.preventDefault();
    event.stopPropagation();
  });

  // Evento para cuando pulsemos el boton de cancelar
  form.addEventListener("reset", function (event) {
    for (const div of this.querySelectorAll(
      "div.valid-feedback, div.invalid-feedback"
    )) {
      div.classList.remove("d-block");
      div.classList.add("d-none");
    }
    for (const input of this.querySelectorAll("input")) {
      input.classList.remove("is-valid");
      input.classList.remove("is-invalid");
    }
    this.ndResName.focus();
  });

  form.ndResName.addEventListener("change", defaultCheckElement);
  form.ndResDescription.addEventListener("change", defaultCheckElement);
}
