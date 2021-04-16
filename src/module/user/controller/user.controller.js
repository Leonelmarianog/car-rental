/* eslint-disable class-methods-use-this */
const { NotFoundException, NotDefinedException } = require('../../common/exception');
const { fromDataToEntity } = require('../mapper/user.mapper');

class UserController {
  /**
   * @param {import('../service/user.service').UserService} userService
   */
  constructor(userService) {
    this.userService = userService;
    this.BASE_ROUTE = '/user';
  }

  /**
   * @param {import('express').Application} app
   */
  configureRoutes(app) {
    app.get(`${this.BASE_ROUTE}`, this.index.bind(this));
    app.get(`${this.BASE_ROUTE}/view/:userId`, this.view.bind(this));
    app.get(`${this.BASE_ROUTE}/create`, this.create.bind(this));
    app.post(`${this.BASE_ROUTE}/save`, this.save.bind(this));
    app.get(`${this.BASE_ROUTE}/update/:userId`, this.update.bind(this));
    app.get(`${this.BASE_ROUTE}/delete/:userId`, this.delete.bind(this));
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async index(req, res, next) {
    try {
      const users = await this.userService.getAll();
      const { message, error } = req.session;
      res.render('user/view/index.view.html', { users, message, error });
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
      const { userId } = req.params;
      const user = await this.userService.getById(userId);
      res.render('user/view/details.view.html', { user });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof NotDefinedException) {
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
      res.render('user/view/form.view.html');
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
      const userData = { ...req.body };
      const isUpdate = userData.id;
      const user = fromDataToEntity(userData);
      const savedUser = await this.userService.save(user);

      if (isUpdate) {
        req.session.message = `User with Id ${savedUser.id} sucessfully updated.`;
      } else {
        req.session.message = `User with Id ${savedUser.id} sucessfully created.`;
      }

      res.redirect(this.BASE_ROUTE);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof NotDefinedException) {
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
      const { userId } = req.params;
      const user = await this.userService.getById(userId);
      res.render('user/view/form.view.html', { user });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof NotDefinedException) {
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
      const { userId } = req.params;
      await this.userService.delete(userId);
      req.session.message = `User with Id ${userId} sucessfully deleted.`;
      res.redirect(this.BASE_ROUTE);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof NotDefinedException) {
        req.session.error = error.message;
        res.redirect(this.BASE_ROUTE);
      } else {
        next(error);
      }
    }
  }
}

module.exports = { UserController };
