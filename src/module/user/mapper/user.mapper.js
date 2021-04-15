const { User } = require('../entity/user.entity');

/**
 * @param {Object} modelInstance
 * @returns {import('../entity/user.entity').User} - User entity
 */
function fromModelToEntity(modelInstance) {
  return new User(modelInstance.toJSON());
}

/**
 * @param {Object} - Form data
 * @returns {import('../entity/user.entity').User} - User entity
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
  return new User({
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
