const { CarController } = require('../car.controller');
const { NotFoundException } = require('../../../common/exception');
const { fromDataToEntity } = require('../../mapper/car.mapper');

describe('CarController', () => {
  const carServiceMock = {
    getAll: jest.fn(),
    getById: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
  const carController = new CarController(carServiceMock);
  let reqMock;
  let resMock;
  let nextMock;

  beforeEach(async () => {
    reqMock = {
      body: {},
      params: {},
      session: {},
    };
    resMock = {
      render: jest.fn(),
      redirect: jest.fn(),
    };
    nextMock = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('configureRoutes', () => {
    it('maps routes to their respective methods', () => {
      const appMock = {
        get: jest.fn(),
        post: jest.fn(),
      };
      const BASE_ROUTE = '/car';

      carController.configureRoutes(appMock);

      expect(appMock.get).toHaveBeenCalledTimes(5);
      expect(appMock.get).toHaveBeenNthCalledWith(1, `${BASE_ROUTE}`, expect.any(Function));
      expect(appMock.get).toHaveBeenNthCalledWith(
        2,
        `${BASE_ROUTE}/view/:carId`,
        expect.any(Function)
      );
      expect(appMock.get).toHaveBeenNthCalledWith(3, `${BASE_ROUTE}/create`, expect.any(Function));
      expect(appMock.get).toHaveBeenNthCalledWith(
        4,
        `${BASE_ROUTE}/update/:carId`,
        expect.any(Function)
      );
      expect(appMock.get).toHaveBeenNthCalledWith(
        5,
        `${BASE_ROUTE}/delete/:carId`,
        expect.any(Function)
      );
      expect(appMock.post).toHaveBeenCalledTimes(1);
      expect(appMock.post).toHaveBeenCalledWith(`${BASE_ROUTE}/save`, expect.any(Function));
    });
  });

  describe('index', () => {
    describe('When checking all cars', () => {
      it('renders index.view.html along with cars and session data', async () => {
        const carsMock = [];
        const messageMock = undefined;
        const errorMock = undefined;
        carServiceMock.getAll.mockResolvedValueOnce(carsMock);
        reqMock.session.message = messageMock;
        reqMock.session.error = errorMock;

        await carController.index(reqMock, resMock, nextMock);

        expect(carServiceMock.getAll).toHaveBeenCalledTimes(1);
        expect(resMock.render).toHaveBeenCalledTimes(1);
        expect(resMock.render).toHaveBeenCalledWith('car/view/index.view.html', {
          cars: carsMock,
          message: messageMock,
          error: errorMock,
        });
      });
    });

    describe('When an exception occurs', () => {
      it("passes the error to express's next function", async () => {
        const exception = new Error();
        carServiceMock.getAll.mockRejectedValueOnce(exception);

        await carController.index(reqMock, resMock, nextMock);

        expect(carServiceMock.getAll).toHaveBeenCalledTimes(1);
        expect(resMock.render).toHaveBeenCalledTimes(0);
        expect(nextMock).toHaveBeenCalledTimes(1);
        expect(nextMock).toHaveBeenCalledWith(exception);
      });
    });
  });

  describe('view', () => {
    describe('When checking a particular car', () => {
      it("renders details.view.html along with the car's data", async () => {
        const carMock = {};
        const carId = 1;
        reqMock.params.carId = carId;

        carServiceMock.getById.mockResolvedValueOnce(carMock);

        await carController.view(reqMock, resMock, nextMock);

        expect(carServiceMock.getById).toHaveBeenCalledTimes(1);
        expect(carServiceMock.getById).toHaveBeenCalledWith(carId);
        expect(resMock.render).toHaveBeenCalledTimes(1);
        expect(resMock.render).toHaveBeenCalledWith('car/view/details.view.html', { car: carMock });
      });
    });

    describe('When a concrete exception occurs', () => {
      it('saves error message in session and redirects to index', async () => {
        const carId = 1;
        reqMock.params.carId = carId;
        const concreteException = new NotFoundException('foo');
        carServiceMock.getById.mockRejectedValueOnce(concreteException);

        await carController.view(reqMock, resMock, nextMock);

        expect(carServiceMock.getById).toHaveBeenCalledTimes(1);
        expect(carServiceMock.getById).toHaveBeenCalledWith(carId);
        expect(resMock.render).toHaveBeenCalledTimes(0);
        expect(reqMock.session.error).toBe(concreteException.message);
        expect(resMock.redirect).toHaveBeenCalledTimes(1);
        expect(resMock.redirect).toHaveBeenCalledWith('/car');
      });
    });

    describe('When an exception occurs', () => {
      it("passes the error to express's next function", async () => {
        const carId = 1;
        reqMock.params.carId = carId;
        const exception = new Error();
        carServiceMock.getById.mockRejectedValueOnce(exception);

        await carController.view(reqMock, resMock, nextMock);

        expect(carServiceMock.getById).toHaveBeenCalledTimes(1);
        expect(carServiceMock.getById).toHaveBeenCalledWith(carId);
        expect(resMock.render).toHaveBeenCalledTimes(0);
        expect(reqMock.session.error).toBeUndefined();
        expect(resMock.render).toHaveBeenCalledTimes(0);
        expect(nextMock).toHaveBeenCalledTimes(1);
        expect(nextMock).toHaveBeenCalledWith(exception);
      });
    });
  });

  describe('create', () => {
    describe('When creating a new car', () => {
      it('renders form.view.html', () => {
        carController.create(reqMock, resMock, nextMock);

        expect(resMock.render).toHaveBeenCalledTimes(1);
        expect(resMock.render).toHaveBeenCalledWith('car/view/form.view.html');
      });
    });

    describe('When an exception occurs', () => {
      it("passes the error to express's next function", () => {
        const exception = new Error();
        resMock.render.mockImplementationOnce(() => {
          throw exception;
        });

        carController.create(reqMock, resMock, nextMock);

        expect(resMock.render).toHaveBeenCalledTimes(1);
        expect(nextMock).toHaveBeenCalledTimes(1);
        expect(nextMock).toHaveBeenCalledWith(exception);
      });
    });
  });

  describe('save', () => {
    describe('When saving a new car', () => {
      it('sets session data and redirects to index', async () => {
        const carData = {};
        const car = fromDataToEntity(carData);
        const message = `Car with id ${car.id} successfully created.`;
        reqMock.body = carData;
        carServiceMock.save.mockResolvedValueOnce(car);

        await carController.save(reqMock, resMock, nextMock);

        expect(carServiceMock.save).toHaveBeenCalledTimes(1);
        expect(carServiceMock.save).toHaveBeenCalledWith(car);
        expect(reqMock.session.message).toBe(message);
        expect(resMock.redirect).toHaveBeenCalledTimes(1);
        expect(resMock.redirect).toHaveBeenCalledWith('/car');
      });
    });

    describe('When saving an existent car', () => {
      it('sets session data and redirects to index', async () => {
        const carData = { id: 1 };
        const car = fromDataToEntity(carData);
        const message = `Car with id ${car.id} successfully updated.`;
        reqMock.body = carData;
        carServiceMock.save.mockResolvedValueOnce(car);

        await carController.save(reqMock, resMock, nextMock);

        expect(carServiceMock.save).toHaveBeenCalledTimes(1);
        expect(carServiceMock.save).toHaveBeenCalledWith(car);
        expect(reqMock.session.message).toBe(message);
        expect(resMock.redirect).toHaveBeenCalledTimes(1);
        expect(resMock.redirect).toHaveBeenCalledWith('/car');
      });
    });

    describe('When a concrete exception occurs', () => {
      it('saves error message in session and redirects to index', async () => {
        const concreteException = new NotFoundException('foo');
        const carData = {};
        const car = fromDataToEntity(carData);
        reqMock.body = carData;
        carServiceMock.save.mockRejectedValueOnce(concreteException);

        await carController.save(reqMock, resMock, nextMock);

        expect(carServiceMock.save).toHaveBeenCalledTimes(1);
        expect(carServiceMock.save).toHaveBeenCalledWith(car);
        expect(reqMock.session.message).toBeUndefined();
        expect(reqMock.session.error).toBe(concreteException.message);
        expect(resMock.redirect).toHaveBeenCalledTimes(1);
        expect(resMock.redirect).toHaveBeenCalledWith('/car');
      });
    });

    describe('When an exception occurs', () => {
      it("passes the error to express's next function", async () => {
        const exception = new Error();
        const carData = {};
        const car = fromDataToEntity(carData);
        reqMock.body = carData;
        carServiceMock.save.mockRejectedValueOnce(exception);

        await carController.save(reqMock, resMock, nextMock);

        expect(carServiceMock.save).toHaveBeenCalledTimes(1);
        expect(carServiceMock.save).toHaveBeenCalledWith(car);
        expect(reqMock.session.message).toBeUndefined();
        expect(reqMock.session.error).toBeUndefined();
        expect(resMock.redirect).toHaveBeenCalledTimes(0);
        expect(nextMock).toHaveBeenCalledTimes(1);
        expect(nextMock).toHaveBeenCalledWith(exception);
      });
    });
  });

  describe('update', () => {
    describe('When updating a car', () => {
      it("renders form.view.html along with the car's data", async () => {
        const carMock = {};
        const carId = 1;
        reqMock.params.carId = carId;

        carServiceMock.getById.mockResolvedValueOnce(carMock);

        await carController.update(reqMock, resMock, nextMock);

        expect(carServiceMock.getById).toHaveBeenCalledTimes(1);
        expect(carServiceMock.getById).toHaveBeenCalledWith(carId);
        expect(resMock.render).toHaveBeenCalledTimes(1);
        expect(resMock.render).toHaveBeenCalledWith('car/view/form.view.html', { car: carMock });
      });
    });

    describe('When a concrete exception occurs', () => {
      it('saves error message in session and redirects to index', async () => {
        const carId = 1;
        reqMock.params.carId = carId;
        const concreteException = new NotFoundException('foo');
        carServiceMock.getById.mockRejectedValueOnce(concreteException);

        await carController.update(reqMock, resMock, nextMock);

        expect(carServiceMock.getById).toHaveBeenCalledTimes(1);
        expect(carServiceMock.getById).toHaveBeenCalledWith(carId);
        expect(resMock.render).toHaveBeenCalledTimes(0);
        expect(reqMock.session.error).toBe(concreteException.message);
        expect(resMock.redirect).toHaveBeenCalledTimes(1);
        expect(resMock.redirect).toHaveBeenCalledWith('/car');
      });
    });

    describe('When an exception occurs', () => {
      it("passes the error to express's next function", async () => {
        const carId = 1;
        reqMock.params.carId = carId;
        const exception = new Error();
        carServiceMock.getById.mockRejectedValueOnce(exception);

        await carController.update(reqMock, resMock, nextMock);

        expect(carServiceMock.getById).toHaveBeenCalledTimes(1);
        expect(carServiceMock.getById).toHaveBeenCalledWith(carId);
        expect(resMock.render).toHaveBeenCalledTimes(0);
        expect(reqMock.session.error).toBeUndefined();
        expect(resMock.redirect).toHaveBeenCalledTimes(0);
        expect(nextMock).toHaveBeenCalledTimes(1);
        expect(nextMock).toHaveBeenCalledWith(exception);
      });
    });
  });

  describe('delete', () => {
    describe('When deleting a car', () => {
      it('sets session data and redirects to the index', async () => {
        const carId = 1;
        const message = `Car with Id ${carId} successfully deleted.`;
        reqMock.params.carId = carId;

        await carController.delete(reqMock, resMock, nextMock);

        expect(carServiceMock.delete).toHaveBeenCalledTimes(1);
        expect(carServiceMock.delete).toHaveBeenCalledWith(carId);
        expect(reqMock.session.message).toBe(message);
        expect(resMock.redirect).toHaveBeenCalledTimes(1);
        expect(resMock.redirect).toHaveBeenCalledWith('/car');
      });
    });

    describe('When a concrete exception occurs', () => {
      it('saves error message in session and redirects to index', async () => {
        const carId = 1;
        reqMock.params.carId = carId;
        const concreteException = new NotFoundException('foo');
        carServiceMock.delete.mockRejectedValueOnce(concreteException);

        await carController.delete(reqMock, resMock, nextMock);

        expect(carServiceMock.delete).toHaveBeenCalledTimes(1);
        expect(carServiceMock.delete).toHaveBeenCalledWith(carId);
        expect(reqMock.session.message).toBeUndefined();
        expect(reqMock.session.error).toBe(concreteException.message);
        expect(resMock.redirect).toHaveBeenCalledTimes(1);
        expect(resMock.redirect).toHaveBeenCalledWith('/car');
      });
    });

    describe('When an exception occurs', () => {
      it("passes the error to express's next function", async () => {
        const carId = 1;
        reqMock.params.carId = carId;
        const exception = new Error();
        carServiceMock.delete.mockRejectedValueOnce(exception);

        await carController.delete(reqMock, resMock, nextMock);

        expect(carServiceMock.delete).toHaveBeenCalledTimes(1);
        expect(carServiceMock.delete).toHaveBeenCalledWith(carId);
        expect(reqMock.session.message).toBeUndefined();
        expect(reqMock.session.error).toBeUndefined();
        expect(resMock.redirect).toHaveBeenCalledTimes(0);
        expect(nextMock).toHaveBeenCalledTimes(1);
        expect(nextMock).toHaveBeenCalledWith(exception);
      });
    });
  });
});

/* const CarController = require('../carController');
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
 */
