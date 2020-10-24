const { default: DIContainer, object, get, factory } = require('rsdi');
const { Sequelize } = require('sequelize');
const nunjucks = require('nunjucks');
const session = require('express-session');
const { CarController, CarService, CarRepository, CarModel } = require('../modules/car/module');
const {
  ClientController,
  ClientService,
  ClientRepository,
  ClientModel,
} = require('../modules/client/module');

/**
 * https://sequelize.org/master/manual/getting-started.html
 * @returns {Sequelize} - Database connection
 */
function configureMainSequelizeDatabase() {
  return new Sequelize({
    dialect: 'sqlite',
    storage: process.env.MAIN_DB_PATH,
  });
}

/**
 * @param {DIContainer} container
 */
function configureCarModel(container) {
  const sequelize = container.get('Sequelize');
  CarModel.setup(sequelize);
  return CarModel;
}

function configureClientModel(container) {
  const sequelize = container.get('Sequelize');
  ClientModel.setup(sequelize);
  return ClientModel;
}

/**
 * @returns {Session} - Middleware
 */
function configureSession() {
  const ONE_WEEK_IN_SECONDS = 604800000;
  const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: ONE_WEEK_IN_SECONDS },
  };
  return session(sessionOptions);
}

/**
 * @returns {Object} - Nunjucks flags
 */
function configureNunjucksFlags() {
  return { autoescape: true };
}

/**
 * https://mozilla.github.io/nunjucks/api.html#filesystemloader
 * @returns {import('nunjucks').FileSystemLoader}
 */
function configureNunjucksFileSystemLoader() {
  return new nunjucks.FileSystemLoader('src/modules');
}

/**
 * @param {DIContainer} container
 */
function addCommonDefinitions(container) {
  container.addDefinitions({
    Sequelize: factory(configureMainSequelizeDatabase),
    Session: factory(configureSession),
  });
}

/**
 * @param {DIContainer} container
 */
function addNunjucksDefinitions(container) {
  container.addDefinitions({
    Environment: object(nunjucks.Environment).construct(get('FileSystemLoader'), get('Flags')),
    FileSystemLoader: factory(configureNunjucksFileSystemLoader),
    Flags: factory(configureNunjucksFlags),
  });
}

/**
 * @param {DIContainer} container
 */
function addCarModuleDefinitions(container) {
  container.addDefinitions({
    CarController: object(CarController).construct(get('CarService')),
    CarService: object(CarService).construct(get('CarRepository')),
    CarRepository: object(CarRepository).construct(get('CarModel')),
    CarModel: factory(configureCarModel),
  });
}

/**
 * @param {DIContainer} container
 */
function addClientModuleDefinitions(container) {
  container.addDefinitions({
    ClientController: object(ClientController).construct(get('ClientService')),
    ClientService: object(ClientService).construct(get('ClientRepository')),
    ClientRepository: object(ClientRepository).construct(get('ClientModel')),
    ClientModel: factory(configureClientModel),
  });
}

/**
 * https://github.com/radzserg/rsdi
 * @returns {DIContainer}
 */
function configureDI() {
  const container = new DIContainer();
  addCommonDefinitions(container);
  addNunjucksDefinitions(container);
  addCarModuleDefinitions(container);
  addClientModuleDefinitions(container);
  return container;
}

module.exports = configureDI;
