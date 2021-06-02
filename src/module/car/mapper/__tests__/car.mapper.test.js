const { fromDataToEntity, fromModelToEntity } = require('../car.mapper');
const { Car } = require('../../entity/car.entity');

describe('fromDataToEntity', () => {
  it('maps form data to a car entity', () => {
    const carData = {};

    const car = fromDataToEntity(carData);

    expect(car).toBeInstanceOf(Car);
  });
});

describe('fromModelToEntity', () => {
  it('maps model data to a car entity', () => {
    const carModel = {
      toJSON: jest.fn(),
    };

    carModel.toJSON.mockReturnValueOnce({});

    const car = fromModelToEntity(carModel);

    expect(car).toBeInstanceOf(Car);
  });
});
