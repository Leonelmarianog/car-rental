const Rent = require('../entity/rent');

/**
 * @param {Object} modelInstance
 * @returns {Rent} - Rent entity
 */
function fromModelToEntity(modelInstance) {
  return new Rent(modelInstance.toJSON());
}

/**
 * @param {Object} - Form data
 * @returns {Rent} - Rent Entity
 */
function fromDataToEntity({
  id,
  'fk-car-id': fkCarId,
  'fk-client-id': fkClientId,
  'price-per-day': pricePerDay,
  'start-date': startDate,
  'finish-date': finishDate,
  'total-price': totalPrice,
  'payment-method': paymentMethod,
  paid,
}) {
  return new Rent({
    id: Number(id),
    fkCarId: Number(fkCarId),
    fkClientId: Number(fkClientId),
    pricePerDay: Number(pricePerDay),
    startDate,
    finishDate,
    totalPrice: Number(totalPrice),
    paymentMethod,
    paid: Boolean(paid),
  });
}

module.exports = {
  fromModelToEntity,
  fromDataToEntity,
};
