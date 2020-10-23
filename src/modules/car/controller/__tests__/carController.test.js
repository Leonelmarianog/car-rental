const CarController = require('../carController');
const Car = require('../../entity/car');

const carServiceMock = {
  save: jest.fn(),
  delete: jest.fn(),
  getById: jest.fn(),
  getAll: jest.fn(),
};

const carController = new CarController(carServiceMock);

afterEach(() => {
  jest.clearAllMocks();
});

test('Sets routes', () => {
  const appMock = {
    get: jest.fn(),
    post: jest.fn(),
  };
  const { BASE_ROUTE } = carController;

  carController.configureRoutes(appMock);

  expect(appMock.get).toHaveBeenCalledTimes(4);
  expect(appMock.get).toHaveBeenNthCalledWith(1, `${BASE_ROUTE}`, expect.any(Function));
  expect(appMock.get).toHaveBeenNthCalledWith(2, `${BASE_ROUTE}/create`, expect.any(Function));
  expect(appMock.get).toHaveBeenNthCalledWith(
    3,
    `${BASE_ROUTE}/update/:carId`,
    expect.any(Function)
  );
  expect(appMock.get).toHaveBeenNthCalledWith(
    4,
    `${BASE_ROUTE}/delete/:carId`,
    expect.any(Function)
  );
  expect(appMock.post).toHaveBeenCalledTimes(1);
  expect(appMock.post).toHaveBeenCalledWith(`${BASE_ROUTE}/save`, expect.any(Function));
});

test('Index method renders index.html with all car records', async () => {
  const reqMock = {
    session: {},
  };
  const resMock = {
    render: jest.fn(),
  };

  carServiceMock.getAll.mockResolvedValue([]);

  await carController.index(reqMock, resMock);

  expect(carServiceMock.getAll).toHaveBeenCalledTimes(1);
  expect(resMock.render).toHaveBeenCalledTimes(1);
  expect(resMock.render).toHaveBeenCalledWith('car/views/index.html', {
    cars: [],
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

  carServiceMock.getAll.mockResolvedValue([]);

  await carController.index(reqMock, resMock);

  expect(reqMock.session.message).toBe(null);
  expect(reqMock.session.error).toBe(null);
});

test('Create method renders form.html', () => {
  const reqMock = {};
  const resMock = {
    render: jest.fn(),
  };

  carController.create(reqMock, resMock);

  expect(resMock.render).toHaveBeenCalledTimes(1);
  expect(resMock.render).toHaveBeenCalledWith('car/views/form.html');
});

test("Save method calls carService's save method to create a new record", async () => {
  const reqMock = {
    body: {
      brand: 'brand',
      model: 'model',
      year: 1234,
      kmh: 123,
      color: 'color',
      'air-conditioner': '1',
      passengers: 4,
      transmission: 'manual',
    },
    session: {
      message: null,
      error: null,
    },
  };
  const resMock = {
    redirect: jest.fn(),
  };
  const car = new Car({
    id: NaN,
    brand: 'brand',
    model: 'model',
    year: 1234,
    kmh: 123,
    color: 'color',
    airConditioner: true,
    passengers: 4,
    transmission: 'manual',
    createdAt: undefined,
    lastUpdated: undefined,
  });
  const { BASE_ROUTE } = carController;

  carServiceMock.save.mockResolvedValueOnce(car);

  await carController.save(reqMock, resMock);

  expect(carServiceMock.save).toHaveBeenCalledTimes(1);
  expect(carServiceMock.save).toHaveBeenCalledWith(car);
  expect(reqMock.session.message).not.toBe(null);
  expect(resMock.redirect).toHaveBeenCalledTimes(1);
  expect(resMock.redirect).toHaveBeenCalledWith(BASE_ROUTE);
});

test("Save method calls carService's save method to update an existing record", async () => {
  const reqMock = {
    body: {
      id: '1',
      brand: 'brand',
      model: 'model',
      year: 1234,
      kmh: 123,
      color: 'color',
      'air-conditioner': '',
      passengers: 4,
      transmission: 'manual',
    },
    session: {
      message: null,
      error: null,
    },
  };
  const resMock = {
    redirect: jest.fn(),
  };
  const car = new Car({
    id: 1,
    brand: 'brand',
    model: 'model',
    year: 1234,
    kmh: 123,
    color: 'color',
    airConditioner: false,
    passengers: 4,
    transmission: 'manual',
    createdAt: undefined,
    lastUpdated: undefined,
  });
  const { BASE_ROUTE } = carController;

  carServiceMock.save.mockResolvedValueOnce(car);

  await carController.save(reqMock, resMock);

  expect(carServiceMock.save).toHaveBeenCalledTimes(1);
  expect(carServiceMock.save).toHaveBeenCalledWith(car);
  expect(reqMock.session.message).not.toBe(null);
  expect(resMock.redirect).toHaveBeenCalledTimes(1);
  expect(resMock.redirect).toHaveBeenCalledWith(BASE_ROUTE);
});

test('Save method redirects when an exception occurs', async () => {
  const reqMock = {
    body: {
      id: '1',
      brand: 'brand',
      model: 'model',
      year: 1234,
      kmh: 123,
      color: 'color',
      'air-conditioner': '',
      passengers: 4,
      transmission: 'manual',
    },
    session: {
      message: null,
      error: null,
    },
  };
  const resMock = {
    redirect: jest.fn(),
  };
  const car = new Car({
    id: 1,
    brand: 'brand',
    model: 'model',
    year: 1234,
    kmh: 123,
    color: 'color',
    airConditioner: false,
    passengers: 4,
    transmission: 'manual',
    createdAt: undefined,
    lastUpdated: undefined,
  });
  const { BASE_ROUTE } = carController;

  carServiceMock.save.mockImplementationOnce(() => {
    throw new Error('error');
  });

  await carController.save(reqMock, resMock);

  expect(carServiceMock.save).toHaveBeenCalledTimes(1);
  expect(carServiceMock.save).toHaveBeenCalledWith(car);
  expect(reqMock.session.error).not.toBe(null);
  expect(resMock.redirect).toHaveBeenCalledTimes(1);
  expect(resMock.redirect).toHaveBeenCalledWith(BASE_ROUTE);
});

test('Update method renders form.html with specific data', async () => {
  const reqMock = {
    params: { carId: '1' },
  };
  const resMock = {
    render: jest.fn(),
    redirect: jest.fn(),
  };

  carServiceMock.getById.mockResolvedValueOnce({});

  await carController.update(reqMock, resMock);

  expect(carServiceMock.getById).toHaveBeenCalledTimes(1);
  expect(carServiceMock.getById).toHaveBeenCalledWith(reqMock.params.carId);
  expect(resMock.render).toHaveBeenCalledTimes(1);
  expect(resMock.render).toHaveBeenCalledWith('car/views/form.html', { car: {} });
});

test('Update method redirects when an exception occurs', async () => {
  const reqMock = {
    params: { carId: '1' },
    session: {
      error: null,
    },
  };
  const resMock = {
    render: jest.fn(),
    redirect: jest.fn(),
  };
  const { BASE_ROUTE } = carController;

  carServiceMock.getById.mockImplementationOnce(() => {
    throw new Error('error');
  });

  await carController.update(reqMock, resMock);

  expect(carServiceMock.getById).toHaveBeenCalledTimes(1);
  expect(carServiceMock.getById).toHaveBeenCalledWith(reqMock.params.carId);
  expect(reqMock.session.error).not.toBe(null);
  expect(resMock.redirect).toHaveBeenCalledTimes(1);
  expect(resMock.redirect).toHaveBeenCalledWith(BASE_ROUTE);
});

test("Delete method calls carService's method to delete a record", async () => {
  const reqMock = {
    params: { carId: '1' },
    session: {
      message: null,
      error: null,
    },
  };
  const resMock = {
    redirect: jest.fn(),
  };
  const { BASE_ROUTE } = carController;

  await carController.delete(reqMock, resMock);

  expect(carServiceMock.delete).toHaveBeenCalledTimes(1);
  expect(carServiceMock.delete).toHaveBeenCalledWith(reqMock.params.carId);
  expect(reqMock.session.message).not.toBe(null);
  expect(resMock.redirect).toHaveBeenCalledTimes(1);
  expect(resMock.redirect).toHaveBeenLastCalledWith(BASE_ROUTE);
});

test('Delete method redirects when an exception occurs', async () => {
  const reqMock = {
    params: { carId: '1' },
    session: {
      message: null,
      error: null,
    },
  };
  const resMock = {
    redirect: jest.fn(),
  };
  const { BASE_ROUTE } = carController;

  carServiceMock.delete.mockImplementationOnce(() => {
    throw new Error('error');
  });

  await carController.delete(reqMock, resMock);

  expect(carServiceMock.delete).toHaveBeenCalledTimes(1);
  expect(carServiceMock.delete).toHaveBeenCalledWith(reqMock.params.carId);
  expect(reqMock.session.error).not.toBe(null);
  expect(resMock.redirect).toHaveBeenCalledTimes(1);
  expect(resMock.redirect).toHaveBeenLastCalledWith(BASE_ROUTE);
});
