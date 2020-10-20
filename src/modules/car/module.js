const CarController = require('./controller/carController');
const CarService = require('./service/carService');
const CarRepository = require('./repository/sqlite/carRepository');
const CarModel = require('./model/carModel');

/**
 * @param {import('express').Application} app
 * @param {import('rsdi').default} container
 */
function init(app, container) {
  /**
   * @type {import('./controller/carController')} carController
   */
  const carController = container.get('CarController');
  carController.configureRoutes(app);
}

module.exports = {
  init,
  CarController,
  CarService,
  CarRepository,
  CarModel,
};
