const RentController = require('../rentController');
const Rent = require('../../entity/rent');

const rentServiceMock = {
  save: jest.fn(),
  delete: jest.fn(),
  getById: jest.fn(),
  getAll: jest.fn(),
};

const rentController = new RentController(rentServiceMock);

afterEach(() => {
  jest.clearAllMocks();
});

test('Sets routes', () => {
  const appMock = {
    get: jest.fn(),
    post: jest.fn(),
  };
  const { BASE_ROUTE } = rentController;

  rentController.configureRoutes(appMock);

  expect(appMock.get).toHaveBeenCalledTimes(4);
  expect(appMock.get).toHaveBeenNthCalledWith(1, `${BASE_ROUTE}`, expect.any(Function));
  expect(appMock.get).toHaveBeenNthCalledWith(2, `${BASE_ROUTE}/create`, expect.any(Function));
  expect(appMock.get).toHaveBeenNthCalledWith(
    3,
    `${BASE_ROUTE}/update/:rentId`,
    expect.any(Function)
  );
  expect(appMock.get).toHaveBeenNthCalledWith(
    4,
    `${BASE_ROUTE}/delete/:rentId`,
    expect.any(Function)
  );
  expect(appMock.post).toHaveBeenCalledTimes(1);
  expect(appMock.post).toHaveBeenCalledWith(`${BASE_ROUTE}/save`, expect.any(Function));
});

test('Index method renders index.html with all rent records', async () => {
  const reqMock = {
    session: {},
  };
  const resMock = {
    render: jest.fn(),
  };

  rentServiceMock.getAll.mockResolvedValue([]);

  await rentController.index(reqMock, resMock);

  expect(rentServiceMock.getAll).toHaveBeenCalledTimes(1);
  expect(resMock.render).toHaveBeenCalledTimes(1);
  expect(resMock.render).toHaveBeenCalledWith('rent/views/index.html', {
    rents: [],
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

  rentServiceMock.getAll.mockResolvedValue([]);

  await rentController.index(reqMock, resMock);

  expect(reqMock.session.message).toBe(null);
  expect(reqMock.session.error).toBe(null);
});

test('Create method renders form.html', () => {
  const reqMock = {};
  const resMock = {
    render: jest.fn(),
  };

  rentController.create(reqMock, resMock);

  expect(resMock.render).toHaveBeenCalledTimes(1);
  expect(resMock.render).toHaveBeenCalledWith('rent/views/form.html');
});

test("Save method calls rentService's save method to create a new record", async () => {
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
  const rent = new Rent({
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
  const { BASE_ROUTE } = rentController;

  rentServiceMock.save.mockResolvedValueOnce(rent);

  await rentController.save(reqMock, resMock);

  expect(rentServiceMock.save).toHaveBeenCalledTimes(1);
  expect(rentServiceMock.save).toHaveBeenCalledWith(rent);
  expect(reqMock.session.message).not.toBe(null);
  expect(resMock.redirect).toHaveBeenCalledTimes(1);
  expect(resMock.redirect).toHaveBeenCalledWith(BASE_ROUTE);
});

test("Save method calls rentService's save method to update an existing record", async () => {
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
  const rent = new Rent({
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
  const { BASE_ROUTE } = rentController;

  rentServiceMock.save.mockResolvedValueOnce(rent);

  await rentController.save(reqMock, resMock);

  expect(rentServiceMock.save).toHaveBeenCalledTimes(1);
  expect(rentServiceMock.save).toHaveBeenCalledWith(rent);
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
  const rent = new Rent({
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
  const { BASE_ROUTE } = rentController;

  rentServiceMock.save.mockImplementationOnce(() => {
    throw new Error('error');
  });

  await rentController.save(reqMock, resMock);

  expect(rentServiceMock.save).toHaveBeenCalledTimes(1);
  expect(rentServiceMock.save).toHaveBeenCalledWith(rent);
  expect(reqMock.session.error).not.toBe(null);
  expect(resMock.redirect).toHaveBeenCalledTimes(1);
  expect(resMock.redirect).toHaveBeenCalledWith(BASE_ROUTE);
});

test('Update method renders form.html with specific data', async () => {
  const reqMock = {
    params: { rentId: '1' },
  };
  const resMock = {
    render: jest.fn(),
    redirect: jest.fn(),
  };

  rentServiceMock.getById.mockResolvedValueOnce({});

  await rentController.update(reqMock, resMock);

  expect(rentServiceMock.getById).toHaveBeenCalledTimes(1);
  expect(rentServiceMock.getById).toHaveBeenCalledWith(reqMock.params.rentId);
  expect(resMock.render).toHaveBeenCalledTimes(1);
  expect(resMock.render).toHaveBeenCalledWith('rent/views/form.html', { rent: {} });
});

test('Update method redirects when an exception occurs', async () => {
  const reqMock = {
    params: { rentId: '1' },
    session: {
      error: null,
    },
  };
  const resMock = {
    render: jest.fn(),
    redirect: jest.fn(),
  };
  const { BASE_ROUTE } = rentController;

  rentServiceMock.getById.mockImplementationOnce(() => {
    throw new Error('error');
  });

  await rentController.update(reqMock, resMock);

  expect(rentServiceMock.getById).toHaveBeenCalledTimes(1);
  expect(rentServiceMock.getById).toHaveBeenCalledWith(reqMock.params.rentId);
  expect(reqMock.session.error).not.toBe(null);
  expect(resMock.redirect).toHaveBeenCalledTimes(1);
  expect(resMock.redirect).toHaveBeenCalledWith(BASE_ROUTE);
});

test("Delete method calls rentService's method to delete a record", async () => {
  const reqMock = {
    params: { rentId: '1' },
    session: {
      message: null,
      error: null,
    },
  };
  const resMock = {
    redirect: jest.fn(),
  };
  const { BASE_ROUTE } = rentController;

  await rentController.delete(reqMock, resMock);

  expect(rentServiceMock.delete).toHaveBeenCalledTimes(1);
  expect(rentServiceMock.delete).toHaveBeenCalledWith(reqMock.params.rentId);
  expect(reqMock.session.message).not.toBe(null);
  expect(resMock.redirect).toHaveBeenCalledTimes(1);
  expect(resMock.redirect).toHaveBeenLastCalledWith(BASE_ROUTE);
});

test('Delete method redirects when an exception occurs', async () => {
  const reqMock = {
    params: { rentId: '1' },
    session: {
      message: null,
      error: null,
    },
  };
  const resMock = {
    redirect: jest.fn(),
  };
  const { BASE_ROUTE } = rentController;

  rentServiceMock.delete.mockImplementationOnce(() => {
    throw new Error('error');
  });

  await rentController.delete(reqMock, resMock);

  expect(rentServiceMock.delete).toHaveBeenCalledTimes(1);
  expect(rentServiceMock.delete).toHaveBeenCalledWith(reqMock.params.rentId);
  expect(reqMock.session.error).not.toBe(null);
  expect(resMock.redirect).toHaveBeenCalledTimes(1);
  expect(resMock.redirect).toHaveBeenLastCalledWith(BASE_ROUTE);
});
