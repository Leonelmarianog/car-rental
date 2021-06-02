const { CarService } = require('../car.service');
const { NotDefinedException } = require('../../../common/exception');
const { Car } = require('../../entity/car.entity');

describe('carService', () => {
  const carRepository = {
    getAll: jest.fn(),
    getById: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
  const carService = new CarService(carRepository);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    describe('When called', () => {
      it('should return an array of car entities', async () => {
        const cars = [];
        carRepository.getAll.mockResolvedValueOnce(cars);

        const result = await carService.getAll();

        expect(carRepository.getAll).toHaveBeenCalledTimes(1);
        expect(result).toBe(cars);
      });
    });
  });

  describe('getById', () => {
    describe('When called with a specific car id', () => {
      it('should return the specific car entity', async () => {
        const carId = 1;
        const car = new Car({ id: carId });
        carRepository.getById.mockResolvedValueOnce(car);

        const result = await carService.getById(carId);

        expect(carRepository.getById).toHaveBeenCalledTimes(1);
        expect(carRepository.getById).toHaveBeenCalledWith(carId);
        expect(result).toBe(car);
      });
    });

    describe('When not passed a valid id', () => {
      it('should throw a "NotDefinedException" error', async () => {
        try {
          await carService.getById();
        } catch (error) {
          expect(error).toBeInstanceOf(NotDefinedException);
        }
      });
    });
  });

  describe('save', () => {
    describe('When called with a car entity', () => {
      it('should save and return the car entity', async () => {
        const carId = 1;
        const car = new Car({ id: carId });
        carRepository.save.mockResolvedValueOnce(car);

        const result = await carService.save(car);

        expect(carRepository.save).toHaveBeenCalledTimes(1);
        expect(carRepository.save).toHaveBeenCalledWith(car);
        expect(result).toBe(car);
      });
    });

    describe('When not passed a valid car entity', () => {
      it('should throw a "NotDefinedException" error', async () => {
        try {
          await carService.save();
        } catch (error) {
          expect(error).toBeInstanceOf(NotDefinedException);
        }
      });
    });
  });

  describe('delete', () => {
    describe('When called with a specific car id', () => {
      it('should delete the specific car and return a boolean (true)', async () => {
        const carId = 1;
        carRepository.delete.mockResolvedValueOnce(true);

        const result = await carService.delete(carId);

        expect(carRepository.delete).toHaveBeenCalledTimes(1);
        expect(carRepository.delete).toHaveBeenCalledWith(carId);
        expect(result).toBe(true);
      });
    });

    describe('When not passed a valid car id', () => {
      it('should throw a "NotDefinedException" error', async () => {
        try {
          await carService.delete();
        } catch (error) {
          expect(error).toBeInstanceOf(NotDefinedException);
        }
      });
    });
  });
});
