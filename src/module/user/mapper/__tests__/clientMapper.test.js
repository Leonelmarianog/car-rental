const { fromDataToEntity, fromModelToEntity } = require('../clientMapper');
const Client = require('../../entity/client');

describe('fromDataToEntity', () => {
  it('Maps form data to a Client entity', () => {
    const formDataMock = {};
    const clientEntity = fromDataToEntity(formDataMock);
    expect(clientEntity).toBeInstanceOf(Client);
  });
});

describe('fromModelToEntity', () => {
  it('Maps model data to a Client entity', () => {
    const modelInstanceMock = {
      toJSON: jest.fn(),
    };

    modelInstanceMock.toJSON.mockResolvedValueOnce({});

    const clientEntity = fromModelToEntity(modelInstanceMock);
    expect(clientEntity).toBeInstanceOf(Client);
  });
});
