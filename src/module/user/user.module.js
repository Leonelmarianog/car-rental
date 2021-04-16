const { UserController } = require('./controller/user.controller');
const { UserService } = require('./service/user.service');
const { UserRepository } = require('./repository/user.repository');
const { UserModel } = require('./model/user.model');

/**
 * @param {import('express').Application} app
 * @param {import('rsdi').default} container
 */
function bootstrap(app, container) {
  /**
   * @type {import('./controller/user.controller').userController}
   */
  const userController = container.get('UserController');
  userController.configureRoutes(app);
}

module.exports = {
  bootstrap,
  UserController,
  UserService,
  UserRepository,
  UserModel,
};
