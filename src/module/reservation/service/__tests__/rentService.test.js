const RentService = require('../rentService');
const RentNotDefinedError = require('../error/rentNotDefinedError');
const RentIdNotDefinedError = require('../error/rentIdNotDefinedError');

const rentRepositoryMock = {
  save: jest.fn(),
  delete: jest.fn(),
  getById: jest.fn(),
  getAll: jest.fn(),
};

const rentService = new RentService(rentRepositoryMock);

test("save method calls rentRepository's save method to save a new rent", async () => {
  const rentMock = {};

  await rentService.save(rentMock);

  expect(rentRepositoryMock.save).toHaveBeenCalledTimes(1);
  expect(rentRepositoryMock.save).toHaveBeenCalledWith(rentMock);
});

test('save method throws an specific error when an exception occurs', async () => {
  await expect(rentService.save()).rejects.toThrowError(RentNotDefinedError);
});

test("delete method calls rentRepository's save method to delete a rent", async () => {
  const idMock = 1;

  await rentService.delete(idMock);

  expect(rentRepositoryMock.delete).toHaveBeenCalledTimes(1);
  expect(rentRepositoryMock.delete).toHaveBeenCalledWith(idMock);
});

test('delete method throws an specific error when an exception occurs', async () => {
  await expect(rentService.delete()).rejects.toThrowError(RentIdNotDefinedError);
});

test("getById method calls rentRepository's getById method to fetch a rent", async () => {
  const idMock = 1;

  await rentService.getById(idMock);

  expect(rentRepositoryMock.getById).toHaveBeenCalledTimes(1);
  expect(rentRepositoryMock.getById).toHaveBeenCalledWith(idMock);
});

test('getById method throws an specific error when an exception occurs', async () => {
  await expect(rentService.getById()).rejects.toThrowError(RentIdNotDefinedError);
});

test("getAll method calls rentRepository's getAll method to fetch all rents", async () => {
  await rentService.getAll();

  expect(rentRepositoryMock.getAll).toHaveBeenCalledTimes(1);
});
