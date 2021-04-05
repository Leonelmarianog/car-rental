class Car {
  constructor({
    id,
    brand,
    model,
    year,
    kmh,
    color,
    airConditioner,
    passengers,
    transmission,
    price,
    createdAt,
    updatedAt,
    deletedAt,
  }) {
    this.id = id;
    this.brand = brand;
    this.model = model;
    this.year = year;
    this.kmh = kmh;
    this.color = color;
    this.airConditioner = airConditioner;
    this.passengers = passengers;
    this.transmission = transmission;
    this.price = price;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}

module.exports = { Car };
