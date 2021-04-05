/* eslint-disable class-methods-use-this */

const AbstractController = require('../../abstractController');
const { fromDataToEntity } = require('../mapper/rentMapper');

class RentController extends AbstractController {
  /**
   * @param {import('../service/rentService')} rentService
   * @param {import('../../car/service/carService')} carService
   * @param {import('../../client/service/clientService')} clientService
   */
  constructor(rentService, carService, clientService) {
    super();
    this.rentService = rentService;
    this.carService = carService;
    this.clientService = clientService;
    this.BASE_ROUTE = '/rent';
  }

  /**
   * @param {import('express').Application} app
   */
  configureRoutes(app) {
    app.get(`${this.BASE_ROUTE}`, this.index.bind(this));
    app.get(`${this.BASE_ROUTE}/view/:rentId`, this.view.bind(this));
    app.get(`${this.BASE_ROUTE}/create`, this.create.bind(this));
    app.post(`${this.BASE_ROUTE}/save`, this.save.bind(this));
    app.get(`${this.BASE_ROUTE}/update/:rentId`, this.update.bind(this));
    app.get(`${this.BASE_ROUTE}/delete/:rentId`, this.delete.bind(this));
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async index(req, res) {
    const rents = await this.rentService.getAll();
    const { message, error } = req.session;
    res.render('rent/views/index.html', { rents, message, error });
    req.session.message = null;
    req.session.error = null;
  }

  async view(req, res) {
    const { rentId } = req.params;
    const rent = await this.rentService.getById(rentId);
    res.render('rent/views/details.html', { rent });
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async create(req, res) {
    const cars = await this.carService.getAll();
    const clients = await this.clientService.getAll();
    res.render('rent/views/form.html', { cars, clients });
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async save(req, res) {
    try {
      const rentData = { ...req.body };
      const isUpdate = rentData.id;
      const rent = fromDataToEntity(rentData);
      const savedRent = await this.rentService.save(rent);

      if (isUpdate) {
        req.session.message = `Rent with id ${savedRent.id} sucessfully updated.`;
      } else {
        req.session.message = `Rent with id ${savedRent.id} sucessfully created.`;
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
      const { rentId } = req.params;
      const rent = await this.rentService.getById(rentId);
      const cars = await this.carService.getAll();
      const clients = await this.clientService.getAll();
      res.render('rent/views/form.html', { rent, cars, clients });
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
      const { rentId } = req.params;
      await this.rentService.delete(rentId);
      req.session.message = `Rent with Id ${rentId} sucessfully deleted.`;
    } catch (error) {
      req.session.error = error.message;
    }

    res.redirect(this.BASE_ROUTE);
  }
}

module.exports = RentController;
