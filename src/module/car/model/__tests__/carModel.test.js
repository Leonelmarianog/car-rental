const { Sequelize } = require('sequelize');
const CarModel = require('../carModel');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
});

test('Setup method defines Cars table', async () => {
  CarModel.setup(sequelize);
  await sequelize.sync({ force: true });
  expect(await CarModel.findAll()).toEqual([]);
});
