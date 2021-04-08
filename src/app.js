require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');
const { configureDIC } = require('./config/dic');
const { errorHandlerMiddleware } = require('./module/common/middleware');
const { bootstrap: bootstrapCarModule } = require('./module/car/car.module');
/* const { init: initClientModule } = require('./modules/client/module');
const { init: initRentModule } = require('./modules/rent/module'); */

function bootstrap() {
  const app = express();
  const container = configureDIC();
  const PORT = process.env.PORT || 3000;

  nunjucks.configure('src/module', {
    autoescape: true,
    express: app,
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use('/public', express.static('public'));
  app.use(container.get('Session'));

  bootstrapCarModule(app, container);
  /*   initClientModule(app, container);
  initRentModule(app, container); */

  app.use(errorHandlerMiddleware);

  // eslint-disable-next-line no-console
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

bootstrap();
