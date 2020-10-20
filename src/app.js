require('dotenv').config();

const configureDI = require('./config/di');
const setViewEngine = require('./config/viewEngine');
const {
  createExpressApp,
  setBodyParser,
  setBaseRoute,
  initExpressApp,
} = require('./config/express');
const { init: initCarModule } = require('./modules/car/module');

const app = createExpressApp();
const PORT = process.env.PORT || 3000;
const container = configureDI();

setViewEngine(app, container);
setBodyParser(app);
setBaseRoute(app);
initCarModule(app, container);
initExpressApp(app, PORT);