const AbstractClientRepository = require('./abstractClientRepository');
const { fromModelToEntity } = require('../../mapper/clientMapper');
const ClientNotFoundError = require('../error/clientNotFoundError');

class ClientRepository extends AbstractClientRepository {
  /**
   * @param {import('../../model/clientModel')} clientModel
   */
  constructor(ClientModel) {
    super();
    this.ClientModel = ClientModel;
  }

  /**
   * @param {import('../../entity/client')} client
   * @returns {Promise<import('../../entity/client')>}
   */
  async save(client) {
    const isUpdate = client.id;
    let clientId;

    if (isUpdate) {
      const [affectedRows] = await this.ClientModel.update(
        {
          firstName: client.firstName,
          lastName: client.lastName,
          documentType: client.documentType,
          documentNumber: client.documentNumber,
          address: client.address,
          phoneNumber: client.phoneNumber,
          email: client.email,
          birthDate: client.birthDate,
        },
        {
          where: {
            id: client.id,
          },
        }
      );

      if (affectedRows === 0) {
        throw new ClientNotFoundError(`Client with id ${client.id} doesn't exist.`);
      }

      clientId = client.id;
    } else {
      const clientData = await this.ClientModel.create({
        firstName: client.firstName,
        lastName: client.lastName,
        documentType: client.documentType,
        documentNumber: client.documentNumber,
        address: client.address,
        phoneNumber: client.phoneNumber,
        email: client.email,
        birthDate: client.birthDate,
      });

      clientId = clientData.id;
    }

    const savedClient = await this.getById(clientId);
    return savedClient;
  }

  /**
   * @param {Number} id
   * @returns {Boolean}
   */
  async delete(id) {
    const deletedRows = await this.ClientModel.destroy({ where: { id } });

    if (deletedRows === 0) {
      throw new ClientNotFoundError(`Client with id ${id} doesn't exist.`);
    }

    return true;
  }

  /**
   * @param {Number} id
   * @returns {Promise<import('../../entity/client')>}
   */
  async getById(id) {
    const clientData = await this.ClientModel.findByPk(id);

    if (!clientData) {
      throw new ClientNotFoundError(`Client with id ${id} doesn't exist.`);
    }

    const client = fromModelToEntity(clientData);
    return client;
  }

  /**
   * @returns {Promise<Array<import('../../entity/client')>>}
   */
  async getAll() {
    const clientsData = await this.ClientModel.findAll();
    const clients = clientsData.map((clientData) => fromModelToEntity(clientData));
    return clients;
  }
}

module.exports = ClientRepository;
