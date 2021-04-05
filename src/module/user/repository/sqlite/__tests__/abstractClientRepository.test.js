/* eslint-disable max-classes-per-file */

const AbstractClientRepository = require('../abstractClientRepository');
const AbstractClientRepositoryError = require('../../error/abstractClientRepositoryError');
const MethodNotImplementedError = require('../../error/methodNotImplementedError');

test("Can't create an instance of an abstract repository", () => {
  try {
    // eslint-disable-next-line no-new
    new AbstractClientRepository();
  } catch (error) {
    expect(error).toBeInstanceOf(AbstractClientRepositoryError);
  }
});

test('An instance of a concrete repository can be created', () => {
  const ConcreteClientRepository = class extends AbstractClientRepository {};
  const clientRepositoryInstance = new ConcreteClientRepository();

  expect(clientRepositoryInstance).toBeInstanceOf(ConcreteClientRepository);
  expect(clientRepositoryInstance).toBeInstanceOf(AbstractClientRepository);
});

test('A method without concrete implementation throws an specific error when used', async () => {
  const ConcreteClientRepository = class extends AbstractClientRepository {};
  const clientRepositoryInstance = new ConcreteClientRepository();

  await expect(clientRepositoryInstance.save()).rejects.toThrowError(MethodNotImplementedError);
  await expect(clientRepositoryInstance.delete()).rejects.toThrowError(MethodNotImplementedError);
  await expect(clientRepositoryInstance.getById()).rejects.toThrowError(MethodNotImplementedError);
  await expect(clientRepositoryInstance.getAll()).rejects.toThrowError(MethodNotImplementedError);
});
