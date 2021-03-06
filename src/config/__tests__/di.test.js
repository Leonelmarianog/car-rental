require('dotenv').config();

const configureDI = require('../di');

const container = configureDI();

describe('configureDI', () => {
  it('Adds common definitions to the container', () => {
    expect(container.get('Sequelize')).toBeDefined();
    expect(container.get('Session')).toBeDefined();
  });

  it('Adds View Engine definitions to the container', () => {
    expect(container.get('Environment')).toBeDefined();
    expect(container.get('FileSystemLoader')).toBeDefined();
    expect(container.get('Flags')).toBeDefined();
  });

  it('Adds Car module definitions to the container', () => {
    expect(container.get('CarController')).toBeDefined();
    expect(container.get('CarService')).toBeDefined();
    expect(container.get('CarRepository')).toBeDefined();
    expect(container.get('CarModel')).toBeDefined();
  });

  it('Adds Client module definitions to the container', () => {
    expect(container.get('ClientController')).toBeDefined();
    expect(container.get('ClientService')).toBeDefined();
    expect(container.get('ClientRepository')).toBeDefined();
    expect(container.get('ClientModel')).toBeDefined();
  });

  it('Adds Rent module definitions to the container', () => {
    expect(container.get('RentController')).toBeDefined();
    expect(container.get('RentService')).toBeDefined();
    expect(container.get('RentRepository')).toBeDefined();
    expect(container.get('RentModel')).toBeDefined();
  });
});
