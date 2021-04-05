const { CarController } = require('./controller/car.controller');
const { CarService } = require('./service/car.service');
const { CarRepository } = require('./repository/car.repository');
const { CarModel } = require('./model/car.model');

/**
 * @param {import('express').Application} app
 * @param {import('rsdi').default} container
 */
function bootstrap(app, container) {
  /**
   * @type {import('./controller/car.controller').CarController}
   */
  const carController = container.get('CarController');
  carController.configureRoutes(app);
}

module.exports = {
  bootstrap,
  CarController,
  CarService,
  CarRepository,
  CarModel,
};
