/* eslint-disable class-methods-use-this */

const AbstractClientRepositoryError = require('../error/abstractClientRepositoryError');
const MethodNotImplementedError = require('../error/methodNotImplementedError');

class AbstractClientRepository {
  constructor() {
    if (new.target === AbstractClientRepository) {
      throw new AbstractClientRepositoryError("Can't instantiate an abstract class");
    }
  }

  async save() {
    throw new MethodNotImplementedError("Can't use a method that doesn't have an implementation");
  }

  async delete() {
    throw new MethodNotImplementedError("Can't use a method that doesn't have an implementation");
  }

  async getById() {
    throw new MethodNotImplementedError("Can't use a method that doesn't have an implementation");
  }

  async getAll() {
    throw new MethodNotImplementedError("Can't use a method that doesn't have an implementation");
  }
}

module.exports = AbstractClientRepository;
