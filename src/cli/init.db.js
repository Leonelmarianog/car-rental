require('dotenv').config();
const { bootstrap: bootstrapDIC } = require('../config/dic');
const { CarModel } = require('../module/car/car.module');
const { UserModel } = require('../module/user/user.module');
const { ReservationModel } = require('../module/reservation/reservation.module');

const container = bootstrapDIC();
const mainDb = container.get('Sequelize');
const sessionDb = container.get('SessionSequelize');
const sessionStore = container.get('SessionStore');

async function init() {
  await CarModel.setup(mainDb);
  await UserModel.setup(mainDb);
  await ReservationModel.setup(mainDb);

  await ReservationModel.setAssociations(CarModel, UserModel);

  await mainDb.sync({ force: true });
  await sessionDb.sync({ force: true });
  await sessionStore.sync({ force: true });

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
      price: 200,
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
      price: 350,
    },
  ]);

  await UserModel.bulkCreate([
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
