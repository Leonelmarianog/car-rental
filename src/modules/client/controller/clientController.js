/* eslint-disable class-methods-use-this */

const AbstractController = require('../../abstractController');
const { fromDataToEntity } = require('../mapper/clientMapper');

class ClientController extends AbstractController {
  /**
   * @param {import('../service/clientService')} clientService
   */
  constructor(clientService) {
    super();
    this.clientService = clientService;
    this.BASE_ROUTE = '/client';
  }

  /**
   * @param {import('express').Application} app
   */
  configureRoutes(app) {
    app.get(`${this.BASE_ROUTE}`, this.index.bind(this));
    app.get(`${this.BASE_ROUTE}/create`, this.create.bind(this));
    app.post(`${this.BASE_ROUTE}/save`, this.save.bind(this));
    app.get(`${this.BASE_ROUTE}/update/:clientId`, this.update.bind(this));
    app.get(`${this.BASE_ROUTE}/delete/:clientId`, this.delete.bind(this));
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async index(req, res) {
    const clients = await this.clientService.getAll();
    const { message, error } = req.session;
    res.render('client/views/index.html', { clients, message, error });
    req.session.message = null;
    req.session.error = null;
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  create(req, res) {
    res.render('client/views/form.html');
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async save(req, res) {
    try {
      const clientData = { ...req.body };
      const isUpdate = clientData.id;
      const client = fromDataToEntity(clientData);
      const savedClient = await this.clientService.save(client);

      if (isUpdate) {
        req.session.message = `Client with id ${savedClient.id} sucessfully updated.`;
      } else {
        req.session.message = `Client with id ${savedClient.id} sucessfully created.`;
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
      const { clientId } = req.params;
      const client = await this.clientService.getById(clientId);
      res.render('client/views/form.html', { client });
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
      const { clientId } = req.params;
      await this.clientService.delete(clientId);
      req.session.message = `Client with Id ${clientId} sucessfully deleted.`;
    } catch (error) {
      req.session.error = error.message;
    }

    res.redirect(this.BASE_ROUTE);
  }
}

module.exports = ClientController;
