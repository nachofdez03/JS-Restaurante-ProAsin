//Excepción base para ir creando el resto de excepciones.
class BaseException extends Error {
  constructor(message = "", fileName, lineNumber) {
    super(message, fileName, lineNumber);
    this.name = "BaseException";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BaseException);
    }
  }
}

//Excepción por si el parametro es nulo o no es de la instancia correspondiente
class ParameterInvalidException extends BaseException {
  constructor(param) {
    super(
      "El parametro no puede ser nulo y tiene que ser una instancia de " + param
    );
    this.name = "ParameterInvalidException";
  }
}

// El objeto pasado por parametro ya existe
class ExistsException extends BaseException {
  constructor(param) {
    super(param + " ya existe");
    this.param = param;
    this.name = "ExistsException";
  }
}

//El parametro no esta registrado
class NoRegistryException extends BaseException {
  constructor(param) {
    super(param + " no existe");
    this.param = param;
    this.name = "NoRegistryException";
  }
}

//El parametro esta vacio
class EmptyValueException extends BaseException {
  constructor(param) {
    super(param + " no existe");
    this.param = param;
    this.name = "EmptyValueException";
  }
}

export {
  BaseException,
  ParameterInvalidException,
  ExistsException,
  NoRegistryException,
  EmptyValueException,
};
