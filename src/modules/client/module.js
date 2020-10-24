const ClientController = require('./controller/clientController');
const ClientService = require('./service/clientService');
const ClientRepository = require('./repository/sqlite/clientRepository');
const ClientModel = require('./model/clientModel');

/**
 * @param {import('express').Application} app
 * @param {import('rsdi').default} container
 */
function init(app, container) {
  /**
   * @type {import('./controller/clientController')} clientController
   */
  const clientController = container.get('ClientController');
  clientController.configureRoutes(app);
}

module.exports = {
  init,
  ClientController,
  ClientService,
  ClientRepository,
  ClientModel,
};
