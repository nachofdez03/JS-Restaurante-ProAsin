import { User } from "./User.js";

//Simulamos un servicio de autenticación, donde validaremos un usuario admin con contraseña admin

const AuthenticationService = (function () {
  let instantiated;
  function init() {
    // Inicialización del Singleton
    class Authentication {
      constructor() {}

      validateUser(username, password) {
        return !!(username === "admin" && password === "admin");
      }
      getUser(username) {
        let user = null;
        if (username === "admin") user = new User("admin");
        return user;
      }
    }
    const auth = new Authentication();
    Object.freeze(auth);
    return auth;
  }
  return {
    getInstance() {
      if (!instantiated) {
        instantiated = init();
      }
      return instantiated;
    },
  };
})();
export default AuthenticationService;
