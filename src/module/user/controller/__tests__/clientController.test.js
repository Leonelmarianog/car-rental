const ClientController = require('../clientController');
const Client = require('../../entity/client');

const clientServiceMock = {
  save: jest.fn(),
  delete: jest.fn(),
  getById: jest.fn(),
  getAll: jest.fn(),
};

const clientController = new ClientController(clientServiceMock);

afterEach(() => {
  jest.clearAllMocks();
});

test('Sets routes', () => {
  const appMock = {
    get: jest.fn(),
    post: jest.fn(),
  };
  const { BASE_ROUTE } = clientController;

  clientController.configureRoutes(appMock);

  expect(appMock.get).toHaveBeenCalledTimes(4);
  expect(appMock.get).toHaveBeenNthCalledWith(1, `${BASE_ROUTE}`, expect.any(Function));
  expect(appMock.get).toHaveBeenNthCalledWith(2, `${BASE_ROUTE}/create`, expect.any(Function));
  expect(appMock.get).toHaveBeenNthCalledWith(
    3,
    `${BASE_ROUTE}/update/:clientId`,
    expect.any(Function)
  );
  expect(appMock.get).toHaveBeenNthCalledWith(
    4,
    `${BASE_ROUTE}/delete/:clientId`,
    expect.any(Function)
  );
  expect(appMock.post).toHaveBeenCalledTimes(1);
  expect(appMock.post).toHaveBeenCalledWith(`${BASE_ROUTE}/save`, expect.any(Function));
});

test('Index method renders index.html with all client records', async () => {
  const reqMock = {
    session: {},
  };
  const resMock = {
    render: jest.fn(),
  };

  clientServiceMock.getAll.mockResolvedValue([]);

  await clientController.index(reqMock, resMock);

  expect(clientServiceMock.getAll).toHaveBeenCalledTimes(1);
  expect(resMock.render).toHaveBeenCalledTimes(1);
  expect(resMock.render).toHaveBeenCalledWith('client/views/index.html', {
    clients: [],
    message: undefined,
    error: undefined,
  });
});

test('Index method clears session messages and errors', async () => {
  const reqMock = {
    session: {
      message: 'A message',
      error: 'An error message',
    },
  };
  const resMock = {
    render: jest.fn(),
  };

  clientServiceMock.getAll.mockResolvedValue([]);

  await clientController.index(reqMock, resMock);

  expect(reqMock.session.message).toBe(null);
  expect(reqMock.session.error).toBe(null);
});

test('Create method renders form.html', () => {
  const reqMock = {};
  const resMock = {
    render: jest.fn(),
  };

  clientController.create(reqMock, resMock);

  expect(resMock.render).toHaveBeenCalledTimes(1);
  expect(resMock.render).toHaveBeenCalledWith('client/views/form.html');
});

test("Save method calls clientService's save method to create a new record", async () => {
  const reqMock = {
    body: {
      firstname: 'Pepe',
      lastname: 'Lopez',
      'document-type': 'DNI',
      'document-number': '21500785',
      address: 'address',
      'phone-number': '123456789',
      email: 'email@gmail.com',
      birthdate: '4/05/93',
    },
    session: {
      message: null,
      error: null,
    },
  };
  const resMock = {
    redirect: jest.fn(),
  };
  const client = new Client({
    id: NaN,
    firstName: 'Pepe',
    lastName: 'Lopez',
    documentType: 'DNI',
    documentNumber: '21500785',
    address: 'address',
    phoneNumber: '123456789',
    email: 'email@gmail.com',
    birthDate: '4/05/93',
    createdAt: undefined,
    lastUpdated: undefined,
  });
  const { BASE_ROUTE } = clientController;

  clientServiceMock.save.mockResolvedValueOnce(client);

  await clientController.save(reqMock, resMock);

  expect(clientServiceMock.save).toHaveBeenCalledTimes(1);
  expect(clientServiceMock.save).toHaveBeenCalledWith(client);
  expect(reqMock.session.message).not.toBe(null);
  expect(resMock.redirect).toHaveBeenCalledTimes(1);
  expect(resMock.redirect).toHaveBeenCalledWith(BASE_ROUTE);
});

test("Save method calls clientService's save method to update an existing record", async () => {
  const reqMock = {
    body: {
      id: '1',
      firstname: 'Pepe',
      lastname: 'Lopez',
      'document-type': 'DNI',
      'document-number': '21500785',
      address: 'address',
      'phone-number': '123456789',
      email: 'email@gmail.com',
      birthdate: '4/05/93',
    },
    session: {
      message: null,
      error: null,
    },
  };
  const resMock = {
    redirect: jest.fn(),
  };
  const client = new Client({
    id: 1,
    firstName: 'Pepe',
    lastName: 'Lopez',
    documentType: 'DNI',
    documentNumber: '21500785',
    address: 'address',
    phoneNumber: '123456789',
    email: 'email@gmail.com',
    birthDate: '4/05/93',
    createdAt: undefined,
    lastUpdated: undefined,
  });
  const { BASE_ROUTE } = clientController;

  clientServiceMock.save.mockResolvedValueOnce(client);

  await clientController.save(reqMock, resMock);

  expect(clientServiceMock.save).toHaveBeenCalledTimes(1);
  expect(clientServiceMock.save).toHaveBeenCalledWith(client);
  expect(reqMock.session.message).not.toBe(null);
  expect(resMock.redirect).toHaveBeenCalledTimes(1);
  expect(resMock.redirect).toHaveBeenCalledWith(BASE_ROUTE);
});

test('Save method redirects when an exception occurs', async () => {
  const reqMock = {
    body: {
      id: '1',
      firstname: 'Pepe',
      lastname: 'Lopez',
      'document-type': 'DNI',
      'document-number': '21500785',
      address: 'address',
      'phone-number': '123456789',
      email: 'email@gmail.com',
      birthdate: '4/05/93',
    },
    session: {
      message: null,
      error: null,
    },
  };
  const resMock = {
    redirect: jest.fn(),
  };
  const client = new Client({
    id: 1,
    firstName: 'Pepe',
    lastName: 'Lopez',
    documentType: 'DNI',
    documentNumber: '21500785',
    address: 'address',
    phoneNumber: '123456789',
    email: 'email@gmail.com',
    birthDate: '4/05/93',
    createdAt: undefined,
    lastUpdated: undefined,
  });
  const { BASE_ROUTE } = clientController;

  clientServiceMock.save.mockImplementationOnce(() => {
    throw new Error('error');
  });

  await clientController.save(reqMock, resMock);

  expect(clientServiceMock.save).toHaveBeenCalledTimes(1);
  expect(clientServiceMock.save).toHaveBeenCalledWith(client);
  expect(reqMock.session.error).not.toBe(null);
  expect(resMock.redirect).toHaveBeenCalledTimes(1);
  expect(resMock.redirect).toHaveBeenCalledWith(BASE_ROUTE);
});

test('Update method renders form.html with specific data', async () => {
  const reqMock = {
    params: { clientId: '1' },
  };
  const resMock = {
    render: jest.fn(),
    redirect: jest.fn(),
  };

  clientServiceMock.getById.mockResolvedValueOnce({});

  await clientController.update(reqMock, resMock);

  expect(clientServiceMock.getById).toHaveBeenCalledTimes(1);
  expect(clientServiceMock.getById).toHaveBeenCalledWith(reqMock.params.clientId);
  expect(resMock.render).toHaveBeenCalledTimes(1);
  expect(resMock.render).toHaveBeenCalledWith('client/views/form.html', { client: {} });
});

test('Update method redirects when an exception occurs', async () => {
  const reqMock = {
    params: { clientId: '1' },
    session: {
      error: null,
    },
  };
  const resMock = {
    render: jest.fn(),
    redirect: jest.fn(),
  };
  const { BASE_ROUTE } = clientController;

  clientServiceMock.getById.mockImplementationOnce(() => {
    throw new Error('error');
  });

  await clientController.update(reqMock, resMock);

  expect(clientServiceMock.getById).toHaveBeenCalledTimes(1);
  expect(clientServiceMock.getById).toHaveBeenCalledWith(reqMock.params.clientId);
  expect(reqMock.session.error).not.toBe(null);
  expect(resMock.redirect).toHaveBeenCalledTimes(1);
  expect(resMock.redirect).toHaveBeenCalledWith(BASE_ROUTE);
});

test("Delete method calls clientService's method to delete a record", async () => {
  const reqMock = {
    params: { clientId: '1' },
    session: {
      message: null,
      error: null,
    },
  };
  const resMock = {
    redirect: jest.fn(),
  };
  const { BASE_ROUTE } = clientController;

  await clientController.delete(reqMock, resMock);

  expect(clientServiceMock.delete).toHaveBeenCalledTimes(1);
  expect(clientServiceMock.delete).toHaveBeenCalledWith(reqMock.params.clientId);
  expect(reqMock.session.message).not.toBe(null);
  expect(resMock.redirect).toHaveBeenCalledTimes(1);
  expect(resMock.redirect).toHaveBeenLastCalledWith(BASE_ROUTE);
});

test('Delete method redirects when an exception occurs', async () => {
  const reqMock = {
    params: { clientId: '1' },
    session: {
      message: null,
      error: null,
    },
  };
  const resMock = {
    redirect: jest.fn(),
  };
  const { BASE_ROUTE } = clientController;

  clientServiceMock.delete.mockImplementationOnce(() => {
    throw new Error('error');
  });

  await clientController.delete(reqMock, resMock);

  expect(clientServiceMock.delete).toHaveBeenCalledTimes(1);
  expect(clientServiceMock.delete).toHaveBeenCalledWith(reqMock.params.clientId);
  expect(reqMock.session.error).not.toBe(null);
  expect(resMock.redirect).toHaveBeenCalledTimes(1);
  expect(resMock.redirect).toHaveBeenLastCalledWith(BASE_ROUTE);
});
