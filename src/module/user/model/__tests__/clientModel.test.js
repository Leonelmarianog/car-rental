const { Sequelize } = require('sequelize');
const ClientModel = require('../clientModel');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
});

test('Setup method defines Clients table', async () => {
  ClientModel.setup(sequelize);
  await sequelize.sync({ force: true });
  expect(await ClientModel.findAll()).toEqual([]);
});
