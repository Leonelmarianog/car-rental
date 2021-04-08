/**
 * @param {Error} error
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {import('express').RequestHandler}
 */
// eslint-disable-next-line no-unused-vars
function errorHandlerMiddleware(error, req, res, next) {
  res.render('common/view/error.view.html', { error: error.message });
}

module.exports = { errorHandlerMiddleware };
