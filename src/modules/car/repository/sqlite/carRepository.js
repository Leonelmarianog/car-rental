const AbstractCarRepository = require('./abstractRepository');
const { fromModelToEntity } = require('../../mapper/carMapper');
const CarNotFoundError = require('../error/CarNotFoundError');

class CarRepository extends AbstractCarRepository {
  /**
   * @param {import('../../model/carModel')} carModel
   */
  constructor(CarModel) {
    super();
    this.CarModel = CarModel;
  }

  /**
   * @param {import('../../entity/car')} car
   * @returns {Promise<import('../../entity/car')>}
   */
  async save(car) {
    const isUpdate = car.id;
    let carId;

    if (isUpdate) {
      const [affectedRows] = await this.CarModel.update(
        {
          brand: car.brand,
          model: car.model,
          year: car.year,
          kmh: car.kmh,
          color: car.color,
          airConditioner: car.airConditioner,
          passengers: car.passengers,
          transmission: car.transmission,
        },
        {
          where: {
            id: car.id,
          },
        }
      );

      if (affectedRows === 0) {
        throw new CarNotFoundError(`Car with id ${car.id} doesn't exist`);
      }

      carId = car.id;
    } else {
      const carData = await this.CarModel.create({
        brand: car.brand,
        model: car.model,
        year: car.year,
        kmh: car.kmh,
        color: car.color,
        airConditioner: car.airConditioner,
        passengers: car.passengers,
        transmission: car.transmission,
      });

      carId = carData.id;
    }

    const savedCar = await this.getById(carId);
    return savedCar;
  }

  /**
   * @param {Number} id
   * @returns {Promise<import('../../entity/car')>}
   */
  async getById(id) {
    const carData = await this.CarModel.findByPk(id);
    const car = fromModelToEntity(carData);
    return car;
  }

  /**
   * @returns {Promise<Array<import('../../entity/car')>>}
   */
  async getAll() {
    const carsData = await this.CarModel.findAll();
    const cars = carsData.map((carData) => fromModelToEntity(carData));
    return cars;
  }
}

module.exports = CarRepository;
