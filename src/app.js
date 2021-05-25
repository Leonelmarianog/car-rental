require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');
const { bootstrap: bootstrapDIC } = require('./config/dic');
const { errorHandlerMiddleware } = require('./module/common/middleware');
const { bootstrap: bootstrapCarModule } = require('./module/car/car.module');
const { bootstrap: bootstrapUserModule } = require('./module/user/user.module');
const {
  bootstrap: bootstrapReservationModule,
} = require('./module/reservation/reservation.module');

function bootstrap() {
  const app = express();
  const container = bootstrapDIC();
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
  bootstrapUserModule(app, container);
  bootstrapReservationModule(app, container);

  app.use(errorHandlerMiddleware);

  // eslint-disable-next-line no-console
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

bootstrap();
