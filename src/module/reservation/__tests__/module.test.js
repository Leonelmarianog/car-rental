const { init } = require('../module');

describe('init', () => {
  it('Initializes Rent module', () => {
    const appMock = {};
    const containerMock = {
      get: jest.fn(),
    };
    const rentControllerMock = {
      configureRoutes: jest.fn(),
    };

    containerMock.get.mockImplementationOnce(() => rentControllerMock);

    init(appMock, containerMock);

    expect(containerMock.get).toHaveBeenCalledTimes(1);
    expect(containerMock.get).toHaveBeenCalledWith('RentController');
    expect(rentControllerMock.configureRoutes).toHaveBeenCalledTimes(1);
    expect(rentControllerMock.configureRoutes).toHaveBeenCalledWith(appMock);
  });
});
