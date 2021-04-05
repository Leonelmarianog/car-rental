/* eslint-disable max-classes-per-file */

const AbstractCarRepository = require('../abstractRepository');
const AbstractCarRepositoryError = require('../../error/abstractCarRepositoryError');
const MethodNotImplementedError = require('../../error/MethodNotImplementedError');

test("Can't create an instance of an abstract repository", () => {
  try {
    // eslint-disable-next-line no-new
    new AbstractCarRepository();
  } catch (error) {
    expect(error).toBeInstanceOf(AbstractCarRepositoryError);
  }
});

test('An instance of a concrete repository can be created', () => {
  const ConcreteCarRepository = class extends AbstractCarRepository {};
  const carRepositoryInstance = new ConcreteCarRepository();

  expect(carRepositoryInstance).toBeInstanceOf(ConcreteCarRepository);
  expect(carRepositoryInstance).toBeInstanceOf(AbstractCarRepository);
});

test('A method without concrete implementation throws an specific error when used', async () => {
  const ConcreteCarRepository = class extends AbstractCarRepository {};
  const carRepositoryInstance = new ConcreteCarRepository();

  await expect(carRepositoryInstance.save()).rejects.toThrowError(MethodNotImplementedError);
  await expect(carRepositoryInstance.delete()).rejects.toThrowError(MethodNotImplementedError);
  await expect(carRepositoryInstance.getById()).rejects.toThrowError(MethodNotImplementedError);
  await expect(carRepositoryInstance.getAll()).rejects.toThrowError(MethodNotImplementedError);
});
