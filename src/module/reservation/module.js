const RentController = require('./controller/rentController');
const RentService = require('./service/rentService');
const RentRepository = require('./repository/sqlite/rentRepository');
const RentModel = require('./model/rentModel');

/**
 * @param {import('express').Application} app
 * @param {import('rsdi').default} container
 */
function init(app, container) {
  /**
   * @type {import('./controller/rentController')} rentController
   */
  const rentController = container.get('RentController');
  rentController.configureRoutes(app);
}

module.exports = {
  init,
  RentController,
  RentService,
  RentRepository,
  RentModel,
};
