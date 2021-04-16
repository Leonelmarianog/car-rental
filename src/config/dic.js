const { default: DIContainer, object, get, factory } = require('rsdi');
const { Sequelize } = require('sequelize');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { CarController, CarService, CarRepository, CarModel } = require('../module/car/car.module');
const {
  UserController,
  UserService,
  UserRepository,
  UserModel,
} = require('../module/user/user.module');
/* const {
  RentController,
  RentService,
  RentRepository,
  RentModel,
} = require('../modules/rent/module'); */

/**
 * @returns {Sequelize} Database connection
 */
function configureMainDatabase() {
  return new Sequelize({
    dialect: 'sqlite',
    storage: process.env.MAIN_DB,
  });
}

/**
 * @returns {Sequelize} Database connection
 */
function configureSessionDatabase() {
  return new Sequelize({
    dialect: 'sqlite',
    storage: process.env.SESSION_DB,
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

/**
 * @param {DIContainer} container
 * @return {UserModel}
 */
function configureUserModel(container) {
  const sequelize = container.get('Sequelize');
  UserModel.setup(sequelize);
  return UserModel;
}

/**
 * @param {DIContainer} container
 * @return {RentModel} RentModel
 */
/* function configureRentModel(container) {
  RentModel.setup(container.get('Sequelize'));
  RentModel.setAssociations(container.get('CarModel'), container.get('ClientModel'));
  return RentModel;
} */

/**
 * @param {DIContainer} container
 * @returns {SequelizeStore} Session Store
 */
function configureSessionStore(container) {
  const sessionSequelize = container.get('SessionSequelize');
  return new SequelizeStore({
    db: sessionSequelize,
  });
}

/**
 * @param {DIContainer} container
 * @returns {Session} Session Middleware
 */
function configureSession(container) {
  const sessionStore = container.get('SessionStore');
  const ONE_WEEK_IN_SECONDS = 604800000;
  return session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: ONE_WEEK_IN_SECONDS },
  });
}

/**
 * @param {DIContainer} container
 */
function addCommonDefinitions(container) {
  container.addDefinitions({
    Sequelize: factory(configureMainDatabase),
    SessionSequelize: factory(configureSessionDatabase),
    SessionStore: factory(configureSessionStore),
    Session: factory(configureSession),
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
function addUserModuleDefinitions(container) {
  container.addDefinitions({
    UserController: object(UserController).construct(get('UserService')),
    UserService: object(UserService).construct(get('UserRepository')),
    UserRepository: object(UserRepository).construct(get('UserModel')),
    UserModel: factory(configureUserModel),
  });
}

/**
 * @param {DIContainer} container
 */
/* function addRentModuleDefinitions(container) {
  container.addDefinitions({
    RentController: object(RentController).construct(
      get('RentService'),
      get('CarService'),
      get('ClientService')
    ),
    RentService: object(RentService).construct(get('RentRepository')),
    RentRepository: object(RentRepository).construct(
      get('RentModel'),
      get('CarModel'),
      get('ClientModel')
    ),
    RentModel: factory(configureRentModel),
  });
} */

/**
 * @returns {DIContainer}
 */
function configureDIC() {
  const container = new DIContainer();
  addCommonDefinitions(container);
  addCarModuleDefinitions(container);
  addUserModuleDefinitions(container);
  /* addRentModuleDefinitions(container); */
  return container;
}

module.exports = { configureDIC };
