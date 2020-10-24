require('dotenv').config();

const configureDI = require('./config/di');
const setViewEngine = require('./config/viewEngine');
const {
  createExpressApp,
  setBodyParser,
  setStaticFolder,
  setSession,
  setBaseRoute,
  initExpressApp,
} = require('./config/express');
const { init: initCarModule } = require('./modules/car/module');
const { init: initClientModule } = require('./modules/client/module');

const app = createExpressApp();
const PORT = process.env.PORT || 3000;
const container = configureDI();

setViewEngine(app, container);
setBodyParser(app);
setStaticFolder(app);
setSession(app, container);
setBaseRoute(app);
initCarModule(app, container);
initClientModule(app, container);
initExpressApp(app, PORT);
