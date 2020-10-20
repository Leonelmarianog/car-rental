const express = require('express');

/**
 * @returns {import('express').Application}
 */
function createExpressApp() {
  const app = express();
  return app;
}

/**
 * @param {import('express').Application} app
 */
function setBodyParser(app) {
  app.use(express.urlencoded({ extended: true }));
}

/**
 * @param {import('express').Application} app
 */
function setBaseRoute(app) {
  app.get('/', (req, res) => {
    res.redirect('/car');
  });
}

/**
 * @param {import('express').Application} app
 * @param {Number} port
 */
function initExpressApp(app, port) {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening to port ${port}...`);
  });
}

module.exports = {
  createExpressApp,
  setBodyParser,
  setBaseRoute,
  initExpressApp,
};
