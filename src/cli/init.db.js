require('dotenv').config();

const configureDI = require('../config/di');
const { CarModel } = require('../modules/car/module');
const { ClientModel } = require('../modules/client/module');

const container = configureDI();
const sequelize = container.get('Sequelize');

async function init() {
  await CarModel.setup(sequelize);
  await ClientModel.setup(sequelize);

  await sequelize.sync({ force: true });

  await CarModel.bulkCreate([
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

  await ClientModel.bulkCreate([
    {
      firstName: 'Pepe',
      lastName: 'Lopez',
      documentType: 'identity card',
      documentNumber: '21500785',
      address: 'Calle 50',
      phoneNumber: '4250-9875',
      email: 'pepe.lopez@gmail.com',
      birthDate: '1993-05-04',
    },
    {
      firstName: 'Juan',
      lastName: 'Ramirez',
      documentType: 'identity card',
      documentNumber: '25555795',
      address: 'Calle 32',
      phoneNumber: '4250-9571',
      email: 'juan.ramirez@gmail.com',
      birthDate: '1995-02-07',
    },
  ]);
}

init();
