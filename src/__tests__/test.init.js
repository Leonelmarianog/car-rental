require('dotenv').config({ path: '.env.test' });
const { bootstrap: bootstrapDIC } = require('../config/dic');
const { bootstrap: bootstrapCarModule, CarModel } = require('../module/car/car.module');
const { bootstrap: bootstrapUserModule, UserModel } = require('../module/user/user.module');
const {
  bootstrap: bootstrapReservationModule,
  ReservationModel,
} = require('../module/reservation/reservation.module');

async function bootstrap() {
  const app = jest.fn();
  app.get = jest.fn();
  app.post = jest.fn();

  const container = bootstrapDIC();
  const sequelize = container.get('Sequelize');

  await CarModel.setup(sequelize).sync({ force: true });
  await UserModel.setup(sequelize).sync({ force: true });
  await ReservationModel.setup(sequelize)
    .setupAssociations(CarModel, UserModel)
    .sync({ force: true });

  bootstrapCarModule(app, container);
  bootstrapUserModule(app, container);
  bootstrapReservationModule(app, container);

  return container;
}

module.exports = { bootstrap };
