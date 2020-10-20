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

  async getAll() {
    const carsData = await this.CarModel.findAll();
    const cars = carsData.map((carData) => fromModelToEntity(carData));
    return cars;
  }
}

module.exports = CarRepository;
