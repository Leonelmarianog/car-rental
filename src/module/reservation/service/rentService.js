const RentNotDefinedError = require('./error/rentNotDefinedError');
const RentIdNotDefinedError = require('./error/rentIdNotDefinedError');

class RentService {
  /**
   * @param {import('../repository/sqlite/rentRepository')} rentRepository
   */
  constructor(rentRepository) {
    this.rentRepository = rentRepository;
  }

  /**
   * @param {import('../../entity/rent')} rent
   * @returns {Promise<import('../../entity/rent')>}
   */
  async save(rent) {
    if (!rent) {
      throw new RentNotDefinedError('A defined Rent is needed to be able to save to the database.');
    }

    const savedRent = await this.rentRepository.save(rent);
    return savedRent;
  }

  /**
   * @param {Number} id
   * @returns {Boolean}
   */
  async delete(id) {
    if (!id) {
      throw new RentIdNotDefinedError('An id is required to delete a Rent from the database.');
    }

    const isDeleted = await this.rentRepository.delete(id);
    return isDeleted;
  }

  /**
   * @param {Number} id
   * @returns {Promise<import('../../entity/rent')>}
   */
  async getById(id) {
    if (!id) {
      throw new RentIdNotDefinedError('An id is required to fetch a Rent from the database.');
    }

    const rent = await this.rentRepository.getById(id);
    return rent;
  }

  /**
   * @returns {Promise<Array<import('../../entity/rent')>>}
   */
  async getAll() {
    const rents = await this.rentRepository.getAll();
    return rents;
  }
}

module.exports = RentService;
