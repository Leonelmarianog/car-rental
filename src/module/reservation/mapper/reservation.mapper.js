const { Reservation } = require('../entity/reservation.entity');
const { fromModelToEntity: fromCarModelToEntity } = require('../../car/mapper/car.mapper');
const { fromModelToEntity: fromUserModelToEntity } = require('../../user/mapper/user.mapper');

/**
 * @param {Object} modelInstance
 * @returns {Reservation} - Reservation entity
 */
function fromModelToEntity({
  id,
  fkCarId,
  fkUserId,
  pricePerDay,
  startDate,
  finishDate,
  totalPrice,
  paymentMethod,
  status,
  createdAt,
  updatedAt,
  deletedAt,
  Car,
  User,
}) {
  const car = Car ? fromCarModelToEntity(Car) : {};
  const user = User ? fromUserModelToEntity(User) : {};

  return new Reservation({
    id,
    fkCarId,
    fkUserId,
    pricePerDay,
    startDate,
    finishDate,
    totalPrice,
    paymentMethod,
    status,
    createdAt,
    updatedAt,
    deletedAt,
    car,
    user,
  });
}

/**
 * @param {Object} - Form data
 * @returns {Reservation} - Reservation Entity
 */
function fromDataToEntity({
  id,
  'fk-car-id': fkCarId,
  'fk-user-id': fkUserId,
  'price-per-day': pricePerDay,
  'start-date': startDate,
  'finish-date': finishDate,
  'total-price': totalPrice,
  'payment-method': paymentMethod,
  status,
  'created-at': createdAt,
}) {
  return new Reservation({
    id: Number(id),
    fkCarId: Number(fkCarId),
    fkUserId: Number(fkUserId),
    pricePerDay: Number(pricePerDay),
    startDate,
    finishDate,
    totalPrice: Number(totalPrice),
    paymentMethod,
    status,
    createdAt,
  });
}

module.exports = {
  fromModelToEntity,
  fromDataToEntity,
};
