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
    createdAt,
    lastUpdated,
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
    this.createdAt = createdAt;
    this.lastUpdated = lastUpdated;
  }
}

module.exports = Car;
