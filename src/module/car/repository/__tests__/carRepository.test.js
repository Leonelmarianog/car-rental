const { Sequelize } = require('sequelize');
const CarRepository = require('../carRepository');
const CarModel = require('../../../model/carModel');
const Car = require('../../../entity/car');
const CarNotFoundError = require('../../error/CarNotFoundError');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
});

let carRepository;

beforeAll(() => {
  CarModel.setup(sequelize);
});

beforeEach(async () => {
  await sequelize.sync({ force: true });

  await CarModel.bulkCreate([
    {
      brand: 'Renault',
      model: '30',
      year: 1978,
      kmh: 185,
      color: 'grey',
      airConditioner: true,
      passengers: 4,
      transmission: 'manual',
    },
    {
      brand: 'Chevrolet',
      model: 'Corsa',
      year: 2002,
      kmh: 155,
      color: 'grey',
      airConditioner: true,
      passengers: 4,
      transmission: 'manual',
    },
  ]);

  carRepository = new CarRepository(CarModel);
});

test('save method stores a new Car in the database', async () => {
  const carMock = {
    id: NaN,
    brand: 'Renault',
    model: '20',
    year: 1970,
    kmh: 170,
    color: 'grey',
    airConditioner: false,
    passengers: 4,
    transmission: 'manual',
    createdAt: undefined,
    lastUpdated: undefined,
  };

  const savedCar = await carRepository.save(carMock);

  expect(savedCar).toBeInstanceOf(Car);
  expect(savedCar.id).toBe(3);
});

test('save method updates an existing Car from the database', async () => {
  const carMock = {
    id: 2,
    brand: 'NEW Chevrolet',
    model: 'Corsa',
    year: 2002,
    kmh: 155,
    color: 'grey',
    airConditioner: true,
    passengers: 4,
    transmission: 'manual',
    createdAt: undefined,
    lastUpdated: undefined,
  };

  const updatedCar = await carRepository.save(carMock);

  expect(updatedCar).toBeInstanceOf(Car);
  expect(updatedCar.id).toBe(2);
  expect(updatedCar.brand).toBe('NEW Chevrolet');
});

test('save method throws an specific error when using an invalid id to update', async () => {
  const carMock = { id: 50 };

  await expect(carRepository.save(carMock)).rejects.toThrowError(CarNotFoundError);
});

test('delete method removes a Car from the database using a valid id', async () => {
  const mockId = 1;

  const isDeleted = await carRepository.delete(mockId);

  expect(isDeleted).toBe(true);
});

test('delete method throws an specific erro when using an invalid id', async () => {
  const mockId = 3;

  await expect(carRepository.delete(mockId)).rejects.toThrowError(CarNotFoundError);
});

test('getById method returns a single Car entity using a valid id', async () => {
  const idMock = 1;
  const car = await carRepository.getById(idMock);

  expect(car).toBeInstanceOf(Car);
});

test('getById method throws an specific error using an invalid id', async () => {
  const idMock = 3;
  await expect(carRepository.getById(idMock)).rejects.toThrowError(CarNotFoundError);
});

test('getAll method returns an array of Car entities', async () => {
  const cars = await carRepository.getAll();

  expect(Array.isArray(cars)).toBeTruthy();
  expect(cars[0]).toBeInstanceOf(Car);
  expect(cars[1]).toBeInstanceOf(Car);
});
