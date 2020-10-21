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

  configureRoutes(app) {
    app.get(`${this.BASE_ROUTE}`, this.index.bind(this));
    app.get(`${this.BASE_ROUTE}/create`, this.create.bind(this));
    app.post(`${this.BASE_ROUTE}/save`, this.save.bind(this));
    app.get(`${this.BASE_ROUTE}/update/:carId`, this.update.bind(this));
  }

  async index(req, res) {
    const cars = await this.carService.getAll();
    res.render('car/views/index.html', { cars });
  }

  create(req, res) {
    res.render('car/views/form.html');
  }

  async save(req, res) {
    const carData = { ...req.body };
    console.log(carData);
    const car = fromDataToEntity(carData);
    await this.carService.save(car);
    res.redirect(this.BASE_ROUTE);
  }

  async update(req, res) {
    const { carId } = req.params;
    const car = await this.carService.getById(carId);
    res.render('car/views/form.html', { car });
  }
}

module.exports = CarController;
