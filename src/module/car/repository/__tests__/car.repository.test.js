const { Sequelize } = require('sequelize');
const { Car } = require('../../entity/car.entity');
const { CarRepository, CarModel } = require('../../car.module');
const { fromDataToEntity } = require('../../mapper/car.mapper');
const { NotFoundException, NotDefinedException } = require('../../../common/exception');

describe('carRepository', () => {
  const carRepository = new CarRepository(CarModel);
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
  });

  beforeEach(async () => {
    await CarModel.setup(sequelize).sync({ force: true });

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
        price: 200,
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
        price: 350,
      },
    ]);
  });

  describe('getAll', () => {
    describe('when cars exists', () => {
      it('should return an array of car entities', async () => {
        const cars = await carRepository.getAll();

        expect(Array.isArray(cars)).toBeTruthy();
        expect(cars[0]).toBeInstanceOf(Car);
        expect(cars[1]).toBeInstanceOf(Car);
      });
    });
  });

  describe('getById', () => {
    describe('when car with a specific id exists', () => {
      it('should return the car entity', async () => {
        const carId = 1;

        const car = await carRepository.getById(carId);

        expect(car).toBeInstanceOf(Car);
        expect(car.id).toBe(carId);
      });
    });

    describe("when a car with a specific id doesn't exists", () => {
      it('should throw a "NotFoundException" error', async () => {
        const carId = 3;

        try {
          await carRepository.getById(carId);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });

    describe('When not passed a valid id', () => {
      it('should throw a "NotDefinedException" error', async () => {
        try {
          await carRepository.getById();
        } catch (error) {
          expect(error).toBeInstanceOf(NotDefinedException);
        }
      });
    });
  });

  describe('save', () => {
    describe('when creating a new car', () => {
      it('should save the new car in the database', async () => {
        const carData = {
          brand: 'Renault',
          model: '19',
          year: 1989,
          kmh: 120,
          color: 'grey',
          airConditioner: true,
          passengers: 4,
          transmission: 'manual',
          price: 250,
        };
        const car = fromDataToEntity(carData);

        const carsBeforeSave = await carRepository.getAll();
        const savedCar = await carRepository.save(car);
        const carsAfterSave = await carRepository.getAll();

        expect(savedCar).toBeInstanceOf(Car);
        expect(carsBeforeSave).toHaveLength(2);
        expect(carsAfterSave).toHaveLength(3);
      });
    });

    describe('when updating an existing car', () => {
      it('should update the existing car in the database', async () => {
        const carData = {
          id: 1,
          brand: 'Renault',
          model: '30',
          year: 1978,
          kmh: 185,
          color: 'YELLOW',
          airConditioner: true,
          passengers: 4,
          transmission: 'manual',
          price: 200,
        };
        const car = fromDataToEntity(carData);

        const carBeforeUpdate = await carRepository.getById(car.id);
        const carAfterUpdate = await carRepository.save(car);

        expect(carAfterUpdate).toBeInstanceOf(Car);
        expect(carAfterUpdate.color).not.toBe(carBeforeUpdate.color);
      });
    });

    describe("when updating a car that doesn't exists", () => {
      it('should throw a "NotFoundException" error', async () => {
        const carData = {
          id: 5,
          brand: undefined,
          model: undefined,
          year: undefined,
          kmh: undefined,
          color: undefined,
          airConditioner: undefined,
          passengers: undefined,
          transmission: undefined,
          price: undefined,
        };
        const car = fromDataToEntity(carData);

        try {
          await carRepository.save(car);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });

    describe('When not passed a valid car entity', () => {
      it('should throw a "NotDefinedException" error', async () => {
        try {
          await carRepository.save();
        } catch (error) {
          expect(error).toBeInstanceOf(NotDefinedException);
        }
      });
    });
  });

  describe('delete', () => {
    describe('when car with specific id exists', () => {
      it('should delete it', async () => {
        const carId = 2;

        const carsBeforeDelete = await carRepository.getAll();
        await carRepository.delete(carId);
        const carsAfterDelete = await carRepository.getAll();

        expect(carsBeforeDelete).not.toBe(carsAfterDelete);
      });
    });

    describe("when car with specific id doesn't exists", () => {
      it('should throw a "NotFoundException" error', async () => {
        const carId = 5;

        try {
          await carRepository.delete(carId);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });

    describe('when not passed a valid id', () => {
      it('should throw a "NotDefinedException" error', async () => {
        try {
          await carRepository.delete();
        } catch (error) {
          expect(error).toBeInstanceOf(NotDefinedException);
        }
      });
    });
  });
});
