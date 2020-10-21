const AbstractCarRepository = require('./abstractRepository');
const { fromModelToEntity } = require('../../mapper/carMapper');

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
   */
  async save(car) {
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
    const savedCar = fromModelToEntity(carData);
    return savedCar;
  }

  async getAll() {
    const carsData = await this.CarModel.findAll();
    const cars = carsData.map((carData) => fromModelToEntity(carData));
    return cars;
  }
}

module.exports = CarRepository;
