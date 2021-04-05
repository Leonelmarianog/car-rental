const { fromDataToEntity, fromModelToEntity } = require('../carMapper');
const Car = require('../../entity/car');

describe('fromDataToEntity', () => {
  it('Maps form data to a Car entity', () => {
    const formDataMock = {};
    const carEntity = fromDataToEntity(formDataMock);
    expect(carEntity).toBeInstanceOf(Car);
  });
});

describe('fromModelToEntity', () => {
  it('Maps model data to a Car entity', () => {
    const modelInstanceMock = {
      toJSON: jest.fn(),
    };

    modelInstanceMock.toJSON.mockResolvedValueOnce({});

    const carEntity = fromModelToEntity(modelInstanceMock);
    expect(carEntity).toBeInstanceOf(Car);
  });
});
