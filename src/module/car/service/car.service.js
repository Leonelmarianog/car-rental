const { NotDefinedException } = require('../../common/exceptions');
const { Car } = require('../entity/car.entity');

class CarService {
  /**
   * @param {import('../repository/car.repository').CarRepository} carRepository
   */
  constructor(carRepository) {
    this.carRepository = carRepository;
  }

  /**
   * @returns {Promise<Array<import('../entity/car.entity').Car>>}
   */
  async getAll() {
    const cars = await this.carRepository.getAll();
    return cars;
  }

  /**
   * @param {Number} id
   * @returns {Promise<import('../entity/car.entity').Car>}
   */
  async getById(id) {
    if (!Number(id)) {
      throw new NotDefinedException('A valid id is required to realize this action.');
    }

    const car = await this.carRepository.getById(id);
    return car;
  }

  /**
   * @param {import('../entity/car.entity').Car} car
   * @returns {Promise<import('../entity/car.entity').Car>}
   */
  async save(car) {
    if (!(car instanceof Car)) {
      throw new NotDefinedException('A defined Car is needed to realize this action.');
    }

    const savedCar = await this.carRepository.save(car);
    return savedCar;
  }

  /**
   * @param {Number} id
   * @returns {Boolean}
   */
  async delete(id) {
    if (!Number(id)) {
      throw new NotDefinedException('A valid id is required to realize this action.');
    }

    const isDeleted = await this.carRepository.delete(id);
    return isDeleted;
  }
}

module.exports = { CarService };
