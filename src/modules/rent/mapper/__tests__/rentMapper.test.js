const { fromDataToEntity, fromModelToEntity } = require('../rentMapper');
const Rent = require('../../entity/rent');

describe('fromDataToEntity', () => {
  it('Maps form data to a Rent entity', () => {
    const formDataMock = {};
    const rentEntity = fromDataToEntity(formDataMock);
    expect(rentEntity).toBeInstanceOf(Rent);
  });
});

describe('fromModelToEntity', () => {
  it('Maps model data to a Rent entity', () => {
    const modelInstanceMock = {
      toJSON: jest.fn(),
    };

    modelInstanceMock.toJSON.mockResolvedValueOnce({});

    const rentEntity = fromModelToEntity(modelInstanceMock);
    expect(rentEntity).toBeInstanceOf(Rent);
  });
});
