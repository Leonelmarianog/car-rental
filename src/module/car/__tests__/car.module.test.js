const { bootstrap: bootstrapCarModule } = require('../car.module');

describe('bootstrapCarModule', () => {
  it('Initializes Car module', () => {
    const appMock = {};
    const containerMock = {
      get: jest.fn(),
    };
    const carControllerMock = {
      configureRoutes: jest.fn(),
    };

    containerMock.get.mockReturnValueOnce(carControllerMock);

    bootstrapCarModule(appMock, containerMock);

    expect(containerMock.get).toHaveBeenCalledTimes(1);
    expect(containerMock.get).toHaveBeenCalledWith('CarController');
    expect(carControllerMock.configureRoutes).toHaveBeenCalledTimes(1);
    expect(carControllerMock.configureRoutes).toHaveBeenCalledWith(appMock);
  });
});
