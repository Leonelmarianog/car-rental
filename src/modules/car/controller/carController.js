/* eslint-disable class-methods-use-this */

const AbstractController = require('../../abstractController');
const { fromDataToEntity } = require('../mapper/carMapper');

class CarController extends AbstractController {
  /**
   * @param {import('../service/carService')} carService
   */
  constructor(carService) {
    super();
    this.carService = carService;
    this.BASE_ROUTE = '/car';
  }

  /**
   * @param {import('express').Application} app
   */
  configureRoutes(app) {
    app.get(`${this.BASE_ROUTE}`, this.index.bind(this));
    app.get(`${this.BASE_ROUTE}/create`, this.create.bind(this));
    app.post(`${this.BASE_ROUTE}/save`, this.save.bind(this));
    app.get(`${this.BASE_ROUTE}/update/:carId`, this.update.bind(this));
    app.get(`${this.BASE_ROUTE}/delete/:carId`, this.delete.bind(this));
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async index(req, res) {
    const cars = await this.carService.getAll();
    const { message, error } = req.session;
    res.render('car/views/index.html', { cars, message, error });
    req.session.message = null;
    req.session.error = null;
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  create(req, res) {
    res.render('car/views/form.html');
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async save(req, res) {
    try {
      const carData = { ...req.body };
      const isUpdate = carData.id;
      const car = fromDataToEntity(carData);
      const savedCar = await this.carService.save(car);

      if (isUpdate) {
        req.session.message = `Car with id ${savedCar.id} sucessfully updated.`;
      } else {
        req.session.message = `Car with id ${savedCar.id} sucessfully created.`;
      }
    } catch (error) {
      req.session.error = error.message;
    }

    res.redirect(this.BASE_ROUTE);
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async update(req, res) {
    try {
      const { carId } = req.params;
      const car = await this.carService.getById(carId);
      res.render('car/views/form.html', { car });
    } catch (error) {
      req.session.error = error.message;
      res.redirect(this.BASE_ROUTE);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async delete(req, res) {
    try {
      const { carId } = req.params;
      await this.carService.delete(carId);
      req.session.message = `Car with Id ${carId} sucessfully deleted.`;
    } catch (error) {
      req.session.error = error.message;
    }

    res.redirect(this.BASE_ROUTE);
  }
}

module.exports = CarController;
