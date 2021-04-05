const { init } = require('../module');

describe('init', () => {
  it('Initializes Client module', () => {
    const appMock = {};
    const containerMock = {
      get: jest.fn(),
    };
    const clientControllerMock = {
      configureRoutes: jest.fn(),
    };

    containerMock.get.mockImplementationOnce(() => clientControllerMock);

    init(appMock, containerMock);

    expect(containerMock.get).toHaveBeenCalledTimes(1);
    expect(containerMock.get).toHaveBeenCalledWith('ClientController');
    expect(clientControllerMock.configureRoutes).toHaveBeenCalledTimes(1);
    expect(clientControllerMock.configureRoutes).toHaveBeenCalledWith(appMock);
  });
});
