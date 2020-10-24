/* eslint-disable class-methods-use-this */

const AbstractRentRepositoryError = require('../error/abstractRentRepositoryError');
const MethodNotImplementedError = require('../error/methodNotImplementedError');

class AbstractRentRepository {
  constructor() {
    if (new.target === AbstractRentRepository) {
      throw new AbstractRentRepositoryError("Can't instantiate an abstract class");
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

module.exports = AbstractRentRepository;
