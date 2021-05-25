const { NotPaidException } = require('../exception');
const { ReservationStatuses } = require('../enum');

class Reservation {
  constructor({
    id,
    fkCarId,
    fkUserId,
    pricePerDay,
    startDate,
    finishDate,
    totalPrice,
    paymentMethod,
    status,
    car,
    user,
    createdAt,
    updatedAt,
    deletedAt,
  }) {
    this.id = id;
    this.fkCarId = fkCarId;
    this.fkUserId = fkUserId;
    this.pricePerDay = pricePerDay;
    this.startDate = startDate;
    this.finishDate = finishDate;
    this.totalPrice = totalPrice;
    this.paymentMethod = paymentMethod;
    this.status = status;
    this.car = car;
    this.user = user;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  calculateReservationLength() {
    const MILISECONDS_IN_A_DAY = 86400000;
    const finishDate = new Date(this.finishDate).getTime();
    const startDate = new Date(this.startDate).getTime();
    return Math.ceil((finishDate - startDate) / MILISECONDS_IN_A_DAY);
  }

  /**
   * @param {import('../../car/entity/car.entity').Car} car
   */
  reserve(car) {
    this.pricePerDay = this.pricePerDay ? this.pricePerDay : car.price;
    this.totalPrice = this.pricePerDay * this.calculateReservationLength();
    return this;
  }

  pay() {
    this.status = ReservationStatuses.PAID;
    return this;
  }

  finish() {
    if (this.status !== ReservationStatuses.PAID) {
      throw new NotPaidException('Reservation must be paid before being finished.');
    }

    this.status = ReservationStatuses.FINISHED;
    return this;
  }

  reset() {
    this.status = ReservationStatuses.PENDING;
    return this;
  }
}

module.exports = { Reservation };
