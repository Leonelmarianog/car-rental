class CarService {
  /**
   * @param {import('../repository/sqlite/carRepository')} carRepository
   */
  constructor(carRepository) {
    this.carRepository = carRepository;
  }

  async getAll() {
    const cars = await this.carRepository.getAll();
    return cars;
  }
}

module.exports = CarService;
