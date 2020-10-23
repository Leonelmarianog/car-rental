const setViewEngine = require('../viewEngine');

describe('setViewEngine', () => {
  it('Sets the view engine', () => {
    const appMock = {};
    const containerMock = {
      get: jest.fn(),
    };
    const envMock = {
      express: jest.fn(),
    };

    containerMock.get.mockImplementationOnce(() => envMock);

    setViewEngine(appMock, containerMock);

    expect(containerMock.get).toHaveBeenCalledTimes(1);
    expect(containerMock.get).toHaveBeenCalledWith('Environment');
    expect(envMock.express).toHaveBeenCalledTimes(1);
    expect(envMock.express).toHaveBeenCalledWith(appMock);
  });
});
