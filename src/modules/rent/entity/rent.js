class Rent {
  constructor({
    id,
    fkCarId,
    fkClientId,
    Car,
    Client,
    unitPrice,
    startDate,
    finishDate,
    totalPrice,
    paymentMethod,
    paid,
    createdAt,
    lastUpdated,
  }) {
    this.id = id;
    this.fkCarId = fkCarId;
    this.fkClientId = fkClientId;
    this.Car = Car;
    this.Client = Client;
    this.unitPrice = unitPrice;
    this.startDate = startDate;
    this.finishDate = finishDate;
    this.totalPrice = totalPrice;
    this.paymentMethod = paymentMethod;
    this.paid = paid;
    this.createdAt = createdAt;
    this.lastUpdated = lastUpdated;
  }
}

module.exports = Rent;
