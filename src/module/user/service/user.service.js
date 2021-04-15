const { NotDefinedException } = require('../../common/exception');
const { User } = require('../entity/user.entity');

class UserService {
  /**
   * @param {import('../repository/user.repository').UserRepository} userRepository
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * @returns {Promise<Array<import('../entity/user.entity').User>>}
   */
  async getAll() {
    const users = await this.userRepository.getAll();
    return users;
  }

  /**
   * @param {Number} id
   * @returns {Promise<import('../entity/user.entity').User>}
   */
  async getById(id) {
    if (!Number(id)) {
      throw new NotDefinedException('A valid id is required to realize this action.');
    }

    const user = await this.userRepository.getById(id);
    return user;
  }

  /**
   * @param {import('../entity/user.entity').User} user
   * @returns {Promise<import('../entity/user.entity').User>}
   */
  async save(user) {
    if (!(user instanceof User)) {
      throw new NotDefinedException('A defined User is required to realize this action.');
    }

    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }

  /**
   * @param {Number} id
   * @returns {Boolean}
   */
  async delete(id) {
    if (!Number(id)) {
      throw new NotDefinedException('A valid id is required to realize this action.');
    }

    const isDeleted = await this.userRepository.delete(id);
    return isDeleted;
  }
}

module.exports = { UserService };
