const Car = require('../entity/car');

/**
 * @param {Object} modelInstance
 * @returns {Car} - Car entity
 */
function fromModelToEntity(modelInstance) {
  return new Car(modelInstance.toJSON());
}

/**
 * @param {Object} - Form data
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
  'price-per-day': pricePerDay,
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
    pricePerDay: Number(pricePerDay),
  });
}

module.exports = {
  fromModelToEntity,
  fromDataToEntity,
};
