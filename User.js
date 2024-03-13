import { EmptyValueException } from "./Excepciones.js";

// Creamos una nueva entidad para gestionar los objetos de tipo usuario
class User {
  // Campos privados
  #username;
  #preferences;
  constructor(username) {
    if (!username) throw new EmptyValueException("username");
    this.#username = username;
    Object.defineProperty(this, "username", {
      enumerable: true,
      get() {
        return this.#username;
      },
    });
    Object.defineProperty(this, "preferences", {
      enumerable: true,
      get() {
        return this.#preferences;
      },
      set(value) {
        if (!value) throw new EmptyValueException("preferences");
        this.#preferences = value;
      },
    });
  }
}
export { User };
