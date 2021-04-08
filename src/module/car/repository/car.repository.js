const { fromModelToEntity } = require('../mapper/car.mapper');
const { NotFoundException, NotDefinedException } = require('../../common/exception');
const { Car } = require('../entity/car.entity');

class CarRepository {
  /**
   * @param {import('../model/car.model').CarModel} CarModel
   */
  constructor(CarModel) {
    this.CarModel = CarModel;
  }

  /**
   * @returns {Promise<Array<import('../entity/car.entity').Car>>}
   */
  async getAll() {
    const carsData = await this.CarModel.findAll();
    const cars = carsData.map((carData) => fromModelToEntity(carData));
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

    const carData = await this.CarModel.findByPk(id);

    if (!carData) {
      throw new NotFoundException(`Car #${id} not found.`);
    }

    const car = fromModelToEntity(carData);
    return car;
  }

  /**
   * @param {import('../entity/car.entity').Car} car
   * @returns {Promise<import('../entity/car.entity').Car>}
   */
  async save(car) {
    if (!(car instanceof Car)) {
      throw new NotDefinedException('A defined car is required to realize this action.');
    }

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
          price: car.price,
        },
        {
          where: {
            id: car.id,
          },
        }
      );

      if (affectedRows === 0) {
        throw new NotFoundException(`Car #${car.id} not found.`);
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
        price: car.price,
      });

      carId = carData.id;
    }

    const savedCar = await this.getById(carId);
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
    const deletedRows = await this.CarModel.destroy({ where: { id } });

    if (deletedRows === 0) {
      throw new NotFoundException(`Car #${id} not found.`);
    }

    return true;
  }
}

module.exports = { CarRepository };
