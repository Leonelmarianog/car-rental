/* eslint-disable class-methods-use-this */

const AbstractCarRepositoryError = require('../error/abstractCarRepositoryError');
const MethodNotImplementedError = require('../error/MethodNotImplementedError');

class AbstractCarRepository {
  constructor() {
    if (new.target === AbstractCarRepository) {
      throw new AbstractCarRepositoryError("Can't instantiate an abstract class");
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

module.exports = AbstractCarRepository;
