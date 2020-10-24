/* eslint-disable max-classes-per-file */

const AbstractRentRepository = require('../abstractRentRepository');
const AbstractRentRepositoryError = require('../../error/abstractRentRepositoryError');
const MethodNotImplementedError = require('../../error/methodNotImplementedError');

test("Can't create an instance of an abstract repository", () => {
  try {
    // eslint-disable-next-line no-new
    new AbstractRentRepository();
  } catch (error) {
    expect(error).toBeInstanceOf(AbstractRentRepositoryError);
  }
});

test('An instance of a concrete repository can be created', () => {
  const ConcreteRentRepository = class extends AbstractRentRepository {};
  const rentRepositoryInstance = new ConcreteRentRepository();

  expect(rentRepositoryInstance).toBeInstanceOf(ConcreteRentRepository);
  expect(rentRepositoryInstance).toBeInstanceOf(AbstractRentRepository);
});

test('A method without concrete implementation throws an specific error when used', async () => {
  const ConcreteRentRepository = class extends AbstractRentRepository {};
  const rentRepositoryInstance = new ConcreteRentRepository();

  await expect(rentRepositoryInstance.save()).rejects.toThrowError(MethodNotImplementedError);
  await expect(rentRepositoryInstance.delete()).rejects.toThrowError(MethodNotImplementedError);
  await expect(rentRepositoryInstance.getById()).rejects.toThrowError(MethodNotImplementedError);
  await expect(rentRepositoryInstance.getAll()).rejects.toThrowError(MethodNotImplementedError);
});
