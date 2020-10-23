const CarService = require('../carService');
const CarNotDefinedError = require('../error/carNotDefinedError');
const CarIdNotDefinedError = require('../error/carIdNotDefinedError');

const carRepositoryMock = {
  save: jest.fn(),
  delete: jest.fn(),
  getById: jest.fn(),
  getAll: jest.fn(),
};

const carService = new CarService(carRepositoryMock);

test("save method calls carRepository's save method to save a new car", async () => {
  const carMock = {};

  await carService.save(carMock);

  expect(carRepositoryMock.save).toHaveBeenCalledTimes(1);
  expect(carRepositoryMock.save).toHaveBeenCalledWith(carMock);
});

test('save method throws an specific error when an exception occurs', async () => {
  await expect(carService.save()).rejects.toThrowError(CarNotDefinedError);
});

test("delete method calls carRepository's save method to delete a car", async () => {
  const idMock = 1;

  await carService.delete(idMock);

  expect(carRepositoryMock.delete).toHaveBeenCalledTimes(1);
  expect(carRepositoryMock.delete).toHaveBeenCalledWith(idMock);
});

test('delete method throws an specific error when an exception occurs', async () => {
  await expect(carService.delete()).rejects.toThrowError(CarIdNotDefinedError);
});

test("getById method calls carRepository's getById method to fetch a car", async () => {
  const idMock = 1;

  await carService.getById(idMock);

  expect(carRepositoryMock.getById).toHaveBeenCalledTimes(1);
  expect(carRepositoryMock.getById).toHaveBeenCalledWith(idMock);
});

test('getById method throws an specific error when an exception occurs', async () => {
  await expect(carService.getById()).rejects.toThrowError(CarIdNotDefinedError);
});

test("getAll method calls carRepository's getAll method to fetch all cars", async () => {
  await carService.getAll();

  expect(carRepositoryMock.getAll).toHaveBeenCalledTimes(1);
});
