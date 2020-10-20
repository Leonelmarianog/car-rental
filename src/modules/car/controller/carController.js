/* eslint-disable class-methods-use-this */

const AbstractController = require('../../abstractController');

class CarController extends AbstractController {
  /**
   * @param {import('../service/carService')} carService
   */
  constructor(carService) {
    super();
    this.carService = carService;
  }

  configureRoutes(app) {
    app.get('/car', this.index.bind(this));
  }

  async index(req, res) {
    const cars = await this.carService.getAll();
    res.render('car/views/index.html', { cars });
  }
}

module.exports = CarController;
