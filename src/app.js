require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');
const configureDI = require('./config/di');
const { init: initCarModule } = require('./modules/car/module');
const { init: initClientModule } = require('./modules/client/module');
const { init: initRentModule } = require('./modules/rent/module');

function bootstrap() {
  const app = express();
  const container = configureDI();
  const PORT = process.env.PORT || 3000;

  nunjucks.configure('src/modules', {
    autoescape: true,
    express: app,
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use('/public', express.static('public'));
  app.use(container.get('Session'));

  initCarModule(app, container);
  initClientModule(app, container);
  initRentModule(app, container);

  // eslint-disable-next-line no-console
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

bootstrap();
