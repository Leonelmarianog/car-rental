const AbstractController = require('../abstractController');
const AbstractControllerError = require('../error/AbstractControllerError');

test("Can't create an instance of an abstract controller", () => {
  try {
    // eslint-disable-next-line no-new
    new AbstractController();
  } catch (error) {
    expect(error).toBeInstanceOf(AbstractControllerError);
  }
});

test('An instance of a concrete controller can be created', () => {
  const ConcreteController = class extends AbstractController {};
  const controllerInstance = new ConcreteController();

  expect(controllerInstance).toBeInstanceOf(ConcreteController);
  expect(controllerInstance).toBeInstanceOf(AbstractController);
});
