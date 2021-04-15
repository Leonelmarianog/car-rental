const { fromModelToEntity } = require('../mapper/user.mapper');
const { NotFoundException, NotDefinedException } = require('../../common/exception');
const { User } = require('../entity/user.entity');

class UserRepository {
  /**
   * @param {import('../model/user.model').UserModel} UserModel
   */
  constructor(UserModel) {
    this.UserModel = UserModel;
  }

  /**
   * @returns {Promise<Array<import('../entity/user.entity').User>>}
   */
  async getAll() {
    const usersData = await this.UserModel.findAll();
    const users = usersData.map((userData) => fromModelToEntity(userData));
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

    const userData = await this.UserModel.findByPk(id);

    if (!userData) {
      throw new NotFoundException(`User #${id} not found`);
    }

    const user = fromModelToEntity(userData);
    return user;
  }

  /**
   * @param {import('../entity/user.entity').User} user
   * @returns {Promise<import('../entity/user.entity').User>}
   */
  async save(user) {
    if (!(user instanceof User)) {
      throw new NotDefinedException('A defined user is required to realize this action.');
    }

    const isUpdate = user.id;
    let userId;

    if (isUpdate) {
      const [affectedRows] = await this.UserModel.update(
        {
          firstName: user.firstName,
          lastName: user.lastName,
          documentType: user.documentType,
          documentNumber: user.documentNumber,
          address: user.address,
          phoneNumber: user.phoneNumber,
          email: user.email,
          birthDate: user.birthDate,
        },
        {
          where: {
            id: user.id,
          },
        }
      );

      if (affectedRows === 0) {
        throw new NotFoundException(`User #${user.id} not found.`);
      }

      userId = user.id;
    } else {
      const userData = await this.UserModel.create({
        firstName: user.firstName,
        lastName: user.lastName,
        documentType: user.documentType,
        documentNumber: user.documentNumber,
        address: user.address,
        phoneNumber: user.phoneNumber,
        email: user.email,
        birthDate: user.birthDate,
      });

      userId = userData.id;
    }

    const savedUser = await this.getById(userId);
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

    const deletedRows = await this.UserModel.destroy({ where: { id } });

    if (deletedRows === 0) {
      throw new NotFoundException(`User #${id} not found.`);
    }

    return true;
  }
}

module.exports = { UserRepository };
