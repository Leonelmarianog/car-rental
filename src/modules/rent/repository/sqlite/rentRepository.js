const AbstractRentRepository = require('./abstractRentRepository');
const { fromModelToEntity } = require('../../mapper/rentMapper');
const RentNotFoundError = require('../error/rentNotFoundError');

class RentRepository extends AbstractRentRepository {
  /**
   * @param {import('../../model/rentModel')} rentModel
   * @param {import('../../../car/model/carModel')} CarModel
   * @param {import('../../../client/model/clientModel')} ClientModel
   */
  constructor(RentModel, CarModel, ClientModel) {
    super();
    this.RentModel = RentModel;
    this.CarModel = CarModel;
    this.ClientModel = ClientModel;
  }

  /**
   * @param {import('../../entity/rent')} rent
   * @returns {Promise<import('../../entity/rent')>}
   */
  async save(rent) {
    const isUpdate = rent.id;
    let rentId;

    if (isUpdate) {
      const [affectedRows] = await this.RentModel.update(
        {
          firstName: rent.firstName,
          lastName: rent.lastName,
          documentType: rent.documentType,
          documentNumber: rent.documentNumber,
          address: rent.address,
          phoneNumber: rent.phoneNumber,
          email: rent.email,
          birthDate: rent.birthDate,
        },
        {
          where: {
            id: rent.id,
          },
        }
      );

      if (affectedRows === 0) {
        throw new RentNotFoundError(`Rent with id ${rent.id} doesn't exist.`);
      }

      rentId = rent.id;
    } else {
      const rentData = await this.RentModel.create({
        firstName: rent.firstName,
        lastName: rent.lastName,
        documentType: rent.documentType,
        documentNumber: rent.documentNumber,
        address: rent.address,
        phoneNumber: rent.phoneNumber,
        email: rent.email,
        birthDate: rent.birthDate,
      });

      rentId = rentData.id;
    }

    const savedRent = await this.getById(rentId);
    return savedRent;
  }

  /**
   * @param {Number} id
   * @returns {Boolean}
   */
  async delete(id) {
    const deletedRows = await this.RentModel.destroy({ where: { id } });

    if (deletedRows === 0) {
      throw new RentNotFoundError(`Rent with id ${id} doesn't exist.`);
    }

    return true;
  }

  /**
   * @param {Number} id
   * @returns {Promise<import('../../entity/rent')>}
   */
  async getById(id) {
    const rentData = await this.RentModel.findByPk(id);

    if (!rentData) {
      throw new RentNotFoundError(`Rent with id ${id} doesn't exist.`);
    }

    const rent = fromModelToEntity(rentData);
    return rent;
  }

  /**
   * @returns {Promise<Array<import('../../entity/rent')>>}
   */
  async getAll() {
    const rentsData = await this.RentModel.findAll({
      include: [
        {
          model: this.CarModel,
          as: 'Car',
        },
        {
          model: this.ClientModel,
          as: 'Client',
        },
      ],
    });
    const rents = rentsData.map((rentData) => fromModelToEntity(rentData));
    return rents;
  }
}

module.exports = RentRepository;
