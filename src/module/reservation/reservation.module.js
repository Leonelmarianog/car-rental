const { ReservationController } = require('./controller/reservation.controller');
const { ReservationService } = require('./service/reservation.service');
const { ReservationRepository } = require('./repository/reservation.repository');
const { ReservationModel } = require('./model/reservation.model');

/**
 * @param {import('express').Application} app
 * @param {import('rsdi').default} container
 */
function bootstrap(app, container) {
  /**
   * @type {import('./controller/reservation.controller').ReservationController}
   */
  const reservationController = container.get('ReservationController');
  reservationController.configureRoutes(app);
}

module.exports = {
  bootstrap,
  ReservationController,
  ReservationService,
  ReservationRepository,
  ReservationModel,
};
