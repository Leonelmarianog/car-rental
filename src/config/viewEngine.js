/**
 * @param {import('express').Application} app
 * @param {import('rsdi').default} container
 */
function setViewEngine(app, container) {
  /**
   * https://mozilla.github.io/nunjucks/api.html#environment
   * @type {import('nunjucks').Environment} env
   */
  const env = container.get('Environment');
  env.express(app); // https://mozilla.github.io/nunjucks/api.html#express
}

module.exports = setViewEngine;
