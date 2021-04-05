const ClientService = require('../clientService');
const ClientNotDefinedError = require('../error/clientNotDefinedError');
const ClientIdNotDefinedError = require('../error/clientIdNotDefinedError');

const clientRepositoryMock = {
  save: jest.fn(),
  delete: jest.fn(),
  getById: jest.fn(),
  getAll: jest.fn(),
};

const clientService = new ClientService(clientRepositoryMock);

test("save method calls clientRepository's save method to save a new client", async () => {
  const clientMock = {};

  await clientService.save(clientMock);

  expect(clientRepositoryMock.save).toHaveBeenCalledTimes(1);
  expect(clientRepositoryMock.save).toHaveBeenCalledWith(clientMock);
});

test('save method throws an specific error when an exception occurs', async () => {
  await expect(clientService.save()).rejects.toThrowError(ClientNotDefinedError);
});

test("delete method calls clientRepository's save method to delete a client", async () => {
  const idMock = 1;

  await clientService.delete(idMock);

  expect(clientRepositoryMock.delete).toHaveBeenCalledTimes(1);
  expect(clientRepositoryMock.delete).toHaveBeenCalledWith(idMock);
});

test('delete method throws an specific error when an exception occurs', async () => {
  await expect(clientService.delete()).rejects.toThrowError(ClientIdNotDefinedError);
});

test("getById method calls clientRepository's getById method to fetch a client", async () => {
  const idMock = 1;

  await clientService.getById(idMock);

  expect(clientRepositoryMock.getById).toHaveBeenCalledTimes(1);
  expect(clientRepositoryMock.getById).toHaveBeenCalledWith(idMock);
});

test('getById method throws an specific error when an exception occurs', async () => {
  await expect(clientService.getById()).rejects.toThrowError(ClientIdNotDefinedError);
});

test("getAll method calls clientRepository's getAll method to fetch all clients", async () => {
  await clientService.getAll();

  expect(clientRepositoryMock.getAll).toHaveBeenCalledTimes(1);
});
