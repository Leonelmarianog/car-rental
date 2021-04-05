const { Car } = require('../entity/car.entity');

/**
 * @param {Object} modelInstance
 * @returns {Car} Car entity
 */
function fromModelToEntity(modelInstance) {
  return new Car(modelInstance.toJSON());
}

/**
 * @param {Object} formData
 * @returns {Car} - Car Entity
 */
function fromDataToEntity({
  id,
  brand,
  model,
  year,
  kmh,
  color,
  'air-conditioner': airConditioner,
  passengers,
  transmission,
  price,
}) {
  return new Car({
    id: Number(id),
    brand,
    model,
    year: Number(year),
    kmh: Number(kmh),
    color,
    airConditioner: Boolean(airConditioner),
    passengers: Number(passengers),
    transmission,
    price: Number(price),
  });
}

module.exports = {
  fromModelToEntity,
  fromDataToEntity,
};
