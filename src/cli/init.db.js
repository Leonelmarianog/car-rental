require('dotenv').config();

const configureDI = require('../config/di');
const { CarModel } = require('../modules/car/module');
const { ClientModel } = require('../modules/client/module');
const { RentModel } = require('../modules/rent/module');

const container = configureDI();
const sequelize = container.get('Sequelize');

async function init() {
  await CarModel.setup(sequelize);
  await ClientModel.setup(sequelize);
  await RentModel.setup(sequelize);

  await RentModel.setAssociations(CarModel, ClientModel);

  await sequelize.sync({ force: true });

  const cars = await CarModel.bulkCreate([
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

  const clients = await ClientModel.bulkCreate([
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

  await RentModel.bulkCreate([
    {
      fkCarId: cars[0].id,
      fkClientId: clients[0].id,
      unitPrice: 200,
      startDate: '2020-05-07',
      finishDate: '2020-06-07',
      totalPrice: 6200,
      paymentMethod: 'credit card',
      paid: false,
    },
    {
      fkCarId: cars[1].id,
      fkClientId: clients[1].id,
      unitPrice: 350,
      startDate: '2020-05-12',
      finishDate: '2020-05-19',
      totalPrice: 2450,
      paymentMethod: 'credit card',
      paid: true,
    },
  ]);
}

init();
