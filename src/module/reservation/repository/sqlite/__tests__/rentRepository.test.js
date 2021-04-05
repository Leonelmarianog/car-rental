const { Sequelize } = require('sequelize');
const RentRepository = require('../rentRepository');
const RentModel = require('../../../model/rentModel');
const Rent = require('../../../entity/rent');
const RentNotFoundError = require('../../error/rentNotFoundError');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
});

let rentRepository;

beforeAll(() => {
  RentModel.setup(sequelize);
});

beforeEach(async () => {
  await sequelize.sync({ force: true });

  await RentModel.bulkCreate([
    {
      firstName: 'Pepe',
      lastName: 'Lopez',
      documentType: 'DNI',
      documentNumber: '21500785',
      address: 'Calle 50',
      phoneNumber: '4250-9875',
      email: 'pepe.lopez@gmail.com',
      birthDate: '4/05/93',
    },
    {
      firstName: 'Juan',
      lastName: 'Ramirez',
      documentType: 'DNI',
      documentNumber: '25555795',
      address: 'Calle 32',
      phoneNumber: '4250-9571',
      email: 'juan.ramirez@gmail.com',
      birthDate: '7/02/95',
    },
  ]);

  rentRepository = new RentRepository(RentModel);
});

test('save method stores a new Rent in the database', async () => {
  const rentMock = {
    id: NaN,
    firstName: 'Carlos',
    lastName: 'Gomez',
    documentType: 'DNI',
    documentNumber: '27546897',
    address: 'Calle 11',
    phoneNumber: '4250-9152',
    email: 'Carlos.Gomez@gmail.com',
    birthDate: '1/12/91',
    createdAt: undefined,
    lastUpdated: undefined,
  };

  const savedRent = await rentRepository.save(rentMock);

  expect(savedRent).toBeInstanceOf(Rent);
  expect(savedRent.id).toBe(3);
});

test('save method updates an existing Rent from the database', async () => {
  const rentMock = {
    id: 2,
    firstName: 'Juan',
    lastName: 'Ramirez',
    documentType: 'DNI',
    documentNumber: '25555795',
    address: 'Calle 76',
    phoneNumber: '4250-9571',
    email: 'juan.ramirez@gmail.com',
    birthDate: '7/02/95',
    createdAt: undefined,
    lastUpdated: undefined,
  };

  const updatedRent = await rentRepository.save(rentMock);

  expect(updatedRent).toBeInstanceOf(Rent);
  expect(updatedRent.id).toBe(2);
  expect(updatedRent.address).toBe('Calle 76');
});

test('save method throws an specific error when using an invalid id to update', async () => {
  const rentMock = { id: 50 };

  await expect(rentRepository.save(rentMock)).rejects.toThrowError(RentNotFoundError);
});

test('delete method removes a Rent from the database using a valid id', async () => {
  const mockId = 1;

  const isDeleted = await rentRepository.delete(mockId);

  expect(isDeleted).toBe(true);
});

test('delete method throws an specific erro when using an invalid id', async () => {
  const mockId = 3;

  await expect(rentRepository.delete(mockId)).rejects.toThrowError(RentNotFoundError);
});

test('getById method returns a single Rent entity using a valid id', async () => {
  const idMock = 1;
  const rent = await rentRepository.getById(idMock);

  expect(rent).toBeInstanceOf(Rent);
});

test('getById method throws an specific error using an invalid id', async () => {
  const idMock = 3;
  await expect(rentRepository.getById(idMock)).rejects.toThrowError(RentNotFoundError);
});

test('getAll method returns an array of Rent entities', async () => {
  const rents = await rentRepository.getAll();

  expect(Array.isArray(rents)).toBeTruthy();
  expect(rents[0]).toBeInstanceOf(Rent);
  expect(rents[1]).toBeInstanceOf(Rent);
});
