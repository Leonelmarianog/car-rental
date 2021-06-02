const { Sequelize } = require('sequelize');
const { CarModel } = require('../car.model');

describe('CarModel', () => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
  });

  describe('setup', () => {
    it('defines car table', async () => {
      await CarModel.setup(sequelize).sync({ force: true });

      const result = await CarModel.findAll();

      expect(result).toEqual([]);
    });
  });
});
