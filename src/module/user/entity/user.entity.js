class User {
  constructor({
    id,
    firstName,
    lastName,
    documentType,
    documentNumber,
    address,
    phoneNumber,
    email,
    birthDate,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.documentType = documentType;
    this.documentNumber = documentNumber;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.birthDate = birthDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = { User };
