const CarNotDefinedError = require('./error/carNotDefinedError');
const CarIdNotDefinedError = require('./error/carIdNotDefinedError');

class CarService {
  /**
   * @param {import('../repository/sqlite/carRepository')} carRepository
   */
  constructor(carRepository) {
    this.carRepository = carRepository;
  }

  /**
   * @param {import('../../entity/car')} car
   * @returns {Promise<import('../../entity/car')>}
   */
  async save(car) {
    if (!car) {
      throw new CarNotDefinedError('A defined Car is needed to be able to save to the database.');
    }

    const savedCar = await this.carRepository.save(car);
    return savedCar;
  }

  /**
   * @param {Number} id
   * @returns {Boolean}
   */
  async delete(id) {
    if (!id) {
      throw new CarIdNotDefinedError('An id is required to delete a Car from the database.');
    }

    const isDeleted = await this.carRepository.delete(id);
    return isDeleted;
  }

  /**
   * @param {Number} id
   * @returns {Promise<import('../../entity/car')>}
   */
  async getById(id) {
    if (!id) {
      throw new CarIdNotDefinedError('An id is required to fetch a Car from the database.');
    }

    const car = await this.carRepository.getById(id);
    return car;
  }

  /**
   * @returns {Promise<Array<import('../../entity/car')>>}
   */
  async getAll() {
    const cars = await this.carRepository.getAll();
    return cars;
  }
}

module.exports = CarService;
