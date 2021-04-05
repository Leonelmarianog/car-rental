const { Model, DataTypes } = require('sequelize');

class ClientModel extends Model {
  /**
   * @param {import('sequelize').Sequelize} sequelizeInstance
   */
  static setup(sequelizeInstance) {
    ClientModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        firstName: {
          field: 'first_name',
          type: DataTypes.TEXT,
          allowNull: false,
        },
        lastName: {
          field: 'last_name',
          type: DataTypes.TEXT,
          allowNull: false,
        },
        documentType: {
          field: 'document_type',
          type: DataTypes.TEXT,
          allowNull: false,
        },
        documentNumber: {
          field: 'document_number',
          type: DataTypes.TEXT,
          allowNull: false,
        },
        address: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        phoneNumber: {
          field: 'phone_number',
          type: DataTypes.TEXT,
          allowNull: false,
        },
        email: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        birthDate: {
          field: 'birthdate',
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize: sequelizeInstance,
        modelName: 'Client',
        tableName: 'Clients',
        updatedAt: 'lastUpdated',
      }
    );
  }
}

module.exports = ClientModel;
