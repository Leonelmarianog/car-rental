const Car = require('../entity/car');

/**
 * @param {Object} modelInstance
 * @returns {Car} - Car entity
 */
function fromModelToEntity(modelInstance) {
  return new Car(modelInstance.toJSON());
}

module.exports = {
  fromModelToEntity,
};
