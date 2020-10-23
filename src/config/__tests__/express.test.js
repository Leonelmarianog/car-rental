const express = require('express');
const {
  createExpressApp,
  setBodyParser,
  setStaticFolder,
  setSession,
  setBaseRoute,
  initExpressApp,
} = require('../express');

jest.mock('express');

describe('createExpressApp', () => {
  it('Returns an express application', () => {
    const appMock = {};

    express.mockImplementationOnce(() => appMock);

    const app = createExpressApp();

    expect(express).toHaveBeenCalledTimes(1);
    expect(app).toBe(appMock);
  });
});

describe('setBodyParser', () => {
  it('Sets the body parser', () => {
    const appMock = {
      use: jest.fn(),
    };

    express.urlencoded.mockImplementationOnce(() => true);

    setBodyParser(appMock);

    expect(appMock.use).toHaveBeenCalledTimes(1);
    expect(appMock.use).toHaveBeenCalledWith(true);
    expect(express.urlencoded).toHaveBeenCalledTimes(1);
    expect(express.urlencoded).toHaveBeenCalledWith(expect.any(Object));
  });
});

describe('setStaticFolder', () => {
  it('Sets the static folder', () => {
    const appMock = {
      use: jest.fn(),
    };

    express.static.mockImplementationOnce(() => true);

    setStaticFolder(appMock);

    expect(appMock.use).toHaveBeenCalledTimes(1);
    expect(appMock.use).toHaveBeenCalledWith('/public', true);
    expect(express.static).toHaveBeenCalledTimes(1);
    expect(express.static).toHaveBeenCalledWith('public');
  });
});

describe('setSession', () => {
  it('Sets session', () => {
    const appMock = {
      use: jest.fn(),
    };
    const containerMock = {
      get: jest.fn(),
    };
    const sessionMock = {};

    containerMock.get.mockImplementationOnce(() => sessionMock);

    setSession(appMock, containerMock);

    expect(containerMock.get).toHaveBeenCalledTimes(1);
    expect(containerMock.get).toHaveBeenCalledWith('Session');
    expect(appMock.use).toHaveBeenCalledTimes(1);
    expect(appMock.use).toHaveBeenCalledWith(sessionMock);
  });
});

describe('setBaseRoute', () => {
  it('Sets the base route', () => {
    const appMock = {
      get: jest.fn(),
    };
    const reqMock = {};
    const resMock = {
      redirect: jest.fn(),
    };

    setBaseRoute(appMock);

    const callback = appMock.get.mock.calls[0][1]; // second argument of the first call

    callback(reqMock, resMock);

    expect(appMock.get).toHaveBeenCalledTimes(1);
    expect(appMock.get).toHaveBeenCalledWith('/', expect.any(Function));
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(resMock.redirect).toHaveBeenCalledWith('/car');
  });

  describe('initExpressApp', () => {
    it('Initializes express app', () => {
      const appMock = {
        listen: jest.fn(),
      };
      const portMock = 3000;

      initExpressApp(appMock, portMock);

      expect(appMock.listen).toHaveBeenCalledTimes(1);
      expect(appMock.listen).toHaveBeenCalledWith(portMock, expect.any(Function));
    });
  });
});
