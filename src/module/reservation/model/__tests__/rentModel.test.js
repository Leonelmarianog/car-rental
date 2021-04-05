const { Sequelize } = require('sequelize');
const RentModel = require('../rentModel');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
});

test('Setup method defines Rents table', async () => {
  RentModel.setup(sequelize);
  await sequelize.sync({ force: true });
  expect(await RentModel.findAll()).toEqual([]);
});
