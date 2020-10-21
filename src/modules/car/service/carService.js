const CarNotDefinedError = require('./error/carNotDefinedError');

class CarService {
  /**
   * @param {import('../repository/sqlite/carRepository')} carRepository
   */
  constructor(carRepository) {
    this.carRepository = carRepository;
  }

  async save(car) {
    if (!car) {
      throw new CarNotDefinedError('You need a defined Car to be able to save to the database');
    }

    const savedCar = await this.carRepository.save(car);
    return savedCar;
  }

  async getAll() {
    const cars = await this.carRepository.getAll();
    return cars;
  }
}

module.exports = CarService;
