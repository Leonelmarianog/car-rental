const { Sequelize } = require('sequelize');
const ClientRepository = require('../clientRepository');
const ClientModel = require('../../../model/clientModel');
const Client = require('../../../entity/client');
const ClientNotFoundError = require('../../error/clientNotFoundError');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
});

let clientRepository;

beforeAll(() => {
  ClientModel.setup(sequelize);
});

beforeEach(async () => {
  await sequelize.sync({ force: true });

  await ClientModel.bulkCreate([
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

  clientRepository = new ClientRepository(ClientModel);
});

test('save method stores a new Client in the database', async () => {
  const clientMock = {
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

  const savedClient = await clientRepository.save(clientMock);

  expect(savedClient).toBeInstanceOf(Client);
  expect(savedClient.id).toBe(3);
});

test('save method updates an existing Client from the database', async () => {
  const clientMock = {
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

  const updatedClient = await clientRepository.save(clientMock);

  expect(updatedClient).toBeInstanceOf(Client);
  expect(updatedClient.id).toBe(2);
  expect(updatedClient.address).toBe('Calle 76');
});

test('save method throws an specific error when using an invalid id to update', async () => {
  const clientMock = { id: 50 };

  await expect(clientRepository.save(clientMock)).rejects.toThrowError(ClientNotFoundError);
});

test('delete method removes a Client from the database using a valid id', async () => {
  const mockId = 1;

  const isDeleted = await clientRepository.delete(mockId);

  expect(isDeleted).toBe(true);
});

test('delete method throws an specific erro when using an invalid id', async () => {
  const mockId = 3;

  await expect(clientRepository.delete(mockId)).rejects.toThrowError(ClientNotFoundError);
});

test('getById method returns a single Client entity using a valid id', async () => {
  const idMock = 1;
  const client = await clientRepository.getById(idMock);

  expect(client).toBeInstanceOf(Client);
});

test('getById method throws an specific error using an invalid id', async () => {
  const idMock = 3;
  await expect(clientRepository.getById(idMock)).rejects.toThrowError(ClientNotFoundError);
});

test('getAll method returns an array of Client entities', async () => {
  const clients = await clientRepository.getAll();

  expect(Array.isArray(clients)).toBeTruthy();
  expect(clients[0]).toBeInstanceOf(Client);
  expect(clients[1]).toBeInstanceOf(Client);
});
