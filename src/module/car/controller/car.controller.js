/* eslint-disable class-methods-use-this */
const { fromDataToEntity } = require('../mapper/car.mapper');
const { NotDefinedException, NotFoundException } = require('../../common/exception');
const { getLimitAndOffset, paginate } = require('../../common/utils/pagination');

class CarController {
  /**
   * @param {import('../service/car.service').CarService} carService
   */
  constructor(carService) {
    this.carService = carService;
    this.BASE_ROUTE = '/car';
  }

  /**
   * @param {import('express').Application} app
   */
  configureRoutes(app) {
    app.get(`${this.BASE_ROUTE}`, this.index.bind(this));
    app.get(`${this.BASE_ROUTE}/view/:carId`, this.view.bind(this));
    app.get(`${this.BASE_ROUTE}/create`, this.create.bind(this));
    app.post(`${this.BASE_ROUTE}/save`, this.save.bind(this));
    app.get(`${this.BASE_ROUTE}/update/:carId`, this.update.bind(this));
    app.get(`${this.BASE_ROUTE}/delete/:carId`, this.delete.bind(this));
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async index(req, res, next) {
    try {
      const { page, size } = req.query;
      const { limit, offset } = getLimitAndOffset(page, size);
      const data = await this.carService.getAll(limit, offset);
      const { results: cars, count, currentPage, totalPages } = paginate(data, page, limit);
      console.log(count, currentPage, totalPages);
      const { message, error } = req.session;
      const numberOfButtons = 2;
      res.render('car/view/index.view.html', {
        cars,
        message,
        error,
        numberOfButtons,
        pages: totalPages,
        activePage: currentPage,
      });
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
      const { carId } = req.params;
      const car = await this.carService.getById(carId);
      res.render('car/view/details.view.html', { car });
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
  create(req, res, next) {
    try {
      res.render('car/view/form.view.html');
    } catch (error) {
      next(error);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async save(req, res, next) {
    try {
      const carData = { ...req.body };
      const isUpdate = carData.id;
      const car = fromDataToEntity(carData);
      const savedCar = await this.carService.save(car);

      if (isUpdate) {
        req.session.message = `Car with id ${savedCar.id} successfully updated.`;
      } else {
        req.session.message = `Car with id ${savedCar.id} successfully created.`;
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
      const { carId } = req.params;
      const car = await this.carService.getById(carId);
      res.render('car/view/form.view.html', { car });
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
      const { carId } = req.params;
      await this.carService.delete(carId);
      req.session.message = `Car with Id ${carId} successfully deleted.`;
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
}

module.exports = { CarController };
