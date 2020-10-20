const AbstractControllerError = require('./error/AbstractControllerError');

class AbstractController {
  constructor() {
    if (new.target === AbstractController) {
      throw new AbstractControllerError("Can't instantiate an abstract class");
    }
  }
}

module.exports = AbstractController;
