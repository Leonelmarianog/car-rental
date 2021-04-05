const Client = require('../entity/client');

/**
 * @param {Object} modelInstance
 * @returns {Client} - Client entity
 */
function fromModelToEntity(modelInstance) {
  return new Client(modelInstance.toJSON());
}

/**
 * @param {Object} - Form data
 * @returns {Client} - Client Entity
 */
function fromDataToEntity({
  id,
  firstname: firstName,
  lastname: lastName,
  'document-type': documentType,
  'document-number': documentNumber,
  address,
  'phone-number': phoneNumber,
  email,
  birthdate: birthDate,
}) {
  return new Client({
    id: Number(id),
    firstName,
    lastName,
    documentType,
    documentNumber,
    address,
    phoneNumber,
    email,
    birthDate,
  });
}

module.exports = {
  fromModelToEntity,
  fromDataToEntity,
};
