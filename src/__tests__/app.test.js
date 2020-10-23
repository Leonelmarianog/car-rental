jest.mock('../config/di');
jest.mock('../config/viewEngine');
jest.mock('../modules/car/module');
jest.mock('../config/express');

const configureDI = require('../config/di');
const setViewEngine = require('../config/viewEngine');
const {
  createExpressApp,
  setBodyParser,
  setStaticFolder,
  setSession,
  setBaseRoute,
  initExpressApp,
} = require('../config/express');
const { init: initCarModule } = require('../modules/car/module');

require('../app');

test('Application initializes', () => {
  expect(createExpressApp).toHaveBeenCalledTimes(1);
  expect(configureDI).toHaveBeenCalledTimes(1);
  expect(setViewEngine).toHaveBeenCalledTimes(1);
  expect(setBodyParser).toHaveBeenCalledTimes(1);
  expect(setStaticFolder).toHaveBeenCalledTimes(1);
  expect(setSession).toHaveBeenCalledTimes(1);
  expect(setBaseRoute).toHaveBeenCalledTimes(1);
  expect(initCarModule).toHaveBeenCalledTimes(1);
  expect(initExpressApp).toHaveBeenCalledTimes(1);
});
