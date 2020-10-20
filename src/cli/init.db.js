require('dotenv').config();

const configureDI = require('../config/di');
const { CarModel } = require('../modules/car/module');

const container = configureDI();
const sequelize = container.get('Sequelize');

async function init() {
  await CarModel.setup(sequelize);

  await sequelize.sync({ force: true });

  CarModel.bulkCreate([
    {
      brand: 'Renault',
      model: '30',
      year: 1978,
      kmh: 185,
      color: 'grey',
      airConditioner: true,
      passengers: 4,
      transmission: 'manual',
    },
    {
      brand: 'Chevrolet',
      model: 'Corsa',
      year: 2002,
      kmh: 155,
      color: 'grey',
      airConditioner: true,
      passengers: 4,
      transmission: 'manual',
    },
  ]);
}

init();
