/* eslint-disable class-methods-use-this */
const { fromDataToEntity } = require('../mapper/reservation.mapper');
const { NotDefinedException, NotFoundException } = require('../../common/exception');
const { NotPaidException, ReservationException } = require('../exception');

class ReservationController {
  /**
   * @param {import('../service/reservation.service').ReservationService} reservationService
   * @param {import('../../car/service/car.service').CarService} carService
   * @param {import('../../user/service/user.service').UserService} userService
   */
  constructor(reservationService, carService, userService) {
    this.reservationService = reservationService;
    this.carService = carService;
    this.userService = userService;
    this.BASE_ROUTE = '/reservation';
  }

  /**
   * @param {import('express').Application} app
   */
  configureRoutes(app) {
    app.get(`${this.BASE_ROUTE}`, this.index.bind(this));
    app.get(`${this.BASE_ROUTE}/view/:reservationId`, this.view.bind(this));
    app.get(`${this.BASE_ROUTE}/create`, this.create.bind(this));
    app.post(`${this.BASE_ROUTE}/save`, this.save.bind(this));
    app.get(`${this.BASE_ROUTE}/update/:reservationId`, this.update.bind(this));
    app.get(`${this.BASE_ROUTE}/delete/:reservationId`, this.delete.bind(this));
    app.get(`${this.BASE_ROUTE}/pay/:reservationId`, this.pay.bind(this));
    app.get(`${this.BASE_ROUTE}/finish/:reservationId`, this.finish.bind(this));
    app.get(`${this.BASE_ROUTE}/reset/:reservationId`, this.reset.bind(this));
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async index(req, res, next) {
    try {
      const reservations = await this.reservationService.getAll();
      const { message, error } = req.session;
      res.render('reservation/view/index.view.html', { reservations, message, error });
      req.session.message = null;
      req.session.error = null;
    } catch (error) {
      next(error);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async view(req, res, next) {
    try {
      const { reservationId } = req.params;
      const reservation = await this.reservationService.getById(reservationId);
      res.render('reservation/view/details.view.html', { reservation });
    } catch (error) {
      if (error instanceof NotDefinedException || error instanceof NotFoundException) {
        req.session.error = error.message;
        res.redirect(this.BASE_ROUTE);
      } else {
        next(error);
      }
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async create(req, res, next) {
    try {
      const cars = await this.carService.getAll();
      const users = await this.userService.getAll();

      if (cars.length === 0) {
        throw new ReservationException('There are no cars available to create a reservation.');
      }

      if (users.length === 0) {
        throw new ReservationException('There are no users available to create a reservation.');
      }

      res.render('reservation/view/form.view.html', { cars, users });
    } catch (error) {
      if (error instanceof NotDefinedException || error instanceof NotFoundException) {
        req.session.error = error.message;
        res.redirect(this.BASE_ROUTE);
      } else {
        next(error);
      }
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async save(req, res, next) {
    try {
      const reservationData = { ...req.body };
      const isUpdate = reservationData.id;
      const reservation = fromDataToEntity(reservationData);
      const savedReservation = await this.reservationService.save(reservation);

      if (isUpdate) {
        req.session.message = `Reservation with id ${savedReservation.id} successfully updated.`;
      } else {
        req.session.message = `Reservation with id ${savedReservation.id} successfully created.`;
      }

      res.redirect(this.BASE_ROUTE);
    } catch (error) {
      if (error instanceof NotDefinedException || error instanceof NotFoundException) {
        req.session.error = error.message;
        res.redirect(this.BASE_ROUTE);
      } else {
        next(error);
      }
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async update(req, res, next) {
    try {
      const { reservationId } = req.params;
      const reservation = await this.reservationService.getById(reservationId);
      const cars = await this.carService.getAll();
      const users = await this.userService.getAll();
      res.render('reservation/view/form.view.html', { reservation, cars, users });
    } catch (error) {
      if (error instanceof NotDefinedException || error instanceof NotFoundException) {
        req.session.error = error.message;
        res.redirect(this.BASE_ROUTE);
      } else {
        next(error);
      }
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async delete(req, res, next) {
    try {
      const { reservationId } = req.params;
      await this.reservationService.delete(reservationId);
      req.session.message = `Reservation with Id ${reservationId} sucessfully deleted.`;
      res.redirect(this.BASE_ROUTE);
    } catch (error) {
      if (error instanceof NotDefinedException || error instanceof NotFoundException) {
        req.session.error = error.message;
        res.redirect(this.BASE_ROUTE);
      } else {
        next(error);
      }
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async pay(req, res, next) {
    try {
      const { reservationId } = req.params;
      const reservation = await this.reservationService.getById(reservationId);
      await this.reservationService.pay(reservation);
      res.redirect(`${this.BASE_ROUTE}/view/${reservationId}`);
    } catch (error) {
      if (error instanceof NotDefinedException || error instanceof NotFoundException) {
        req.session.error = error.message;
        res.redirect(this.BASE_ROUTE);
      } else {
        next(error);
      }
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async finish(req, res, next) {
    const { reservationId } = req.params;
    try {
      const reservation = await this.reservationService.getById(reservationId);
      await this.reservationService.finish(reservation);
      res.redirect(`${this.BASE_ROUTE}/view/${reservationId}`);
    } catch (error) {
      if (
        error instanceof NotDefinedException ||
        error instanceof NotFoundException ||
        error instanceof NotPaidException
      ) {
        req.session.error = error.message;
        res.redirect(this.BASE_ROUTE);
      } else {
        next(error);
      }
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async reset(req, res, next) {
    try {
      const { reservationId } = req.params;
      const reservation = await this.reservationService.getById(reservationId);
      await this.reservationService.reset(reservation);
      res.redirect(`${this.BASE_ROUTE}/view/${reservationId}`);
    } catch (error) {
      if (error instanceof NotDefinedException || error instanceof NotFoundException) {
        req.session.error = error.message;
        res.redirect(this.BASE_ROUTE);
      } else {
        next(error);
      }
    }
  }
}

module.exports = { ReservationController };
