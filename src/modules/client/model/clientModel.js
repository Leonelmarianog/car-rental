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
          type: DataTypes.TEXT,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        documentType: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        documentNumber: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        address: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        phoneNumber: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        email: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        birthDate: {
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
