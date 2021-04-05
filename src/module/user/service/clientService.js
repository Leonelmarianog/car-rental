const ClientNotDefinedError = require('./error/clientNotDefinedError');
const ClientIdNotDefinedError = require('./error/clientIdNotDefinedError');

class ClientService {
  /**
   * @param {import('../repository/sqlite/clientRepository')} clientRepository
   */
  constructor(clientRepository) {
    this.clientRepository = clientRepository;
  }

  /**
   * @param {import('../../entity/client')} client
   * @returns {Promise<import('../../entity/client')>}
   */
  async save(client) {
    if (!client) {
      throw new ClientNotDefinedError(
        'A defined Client is needed to be able to save to the database.'
      );
    }

    const savedClient = await this.clientRepository.save(client);
    return savedClient;
  }

  /**
   * @param {Number} id
   * @returns {Boolean}
   */
  async delete(id) {
    if (!id) {
      throw new ClientIdNotDefinedError('An id is required to delete a Client from the database.');
    }

    const isDeleted = await this.clientRepository.delete(id);
    return isDeleted;
  }

  /**
   * @param {Number} id
   * @returns {Promise<import('../../entity/client')>}
   */
  async getById(id) {
    if (!id) {
      throw new ClientIdNotDefinedError('An id is required to fetch a Client from the database.');
    }

    const client = await this.clientRepository.getById(id);
    return client;
  }

  /**
   * @returns {Promise<Array<import('../../entity/client')>>}
   */
  async getAll() {
    const clients = await this.clientRepository.getAll();
    return clients;
  }
}

module.exports = ClientService;
