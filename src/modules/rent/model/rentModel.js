const { Model, DataTypes } = require('sequelize');

class RentModel extends Model {
  /**
   * @param {import('sequelize').Sequelize} sequelizeInstance
   */
  static setup(sequelizeInstance) {
    RentModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        pricePerDay: {
          field: 'unit_price',
          type: DataTypes.REAL,
          allowNull: false,
        },
        startDate: {
          field: 'start_date',
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        finishDate: {
          field: 'finish_date',
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        totalPrice: {
          field: 'total_price',
          type: DataTypes.REAL,
          allowNull: false,
        },
        paymentMethod: {
          field: 'payment_method',
          type: DataTypes.TEXT,
          allowNull: false,
        },
        paid: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      },
      {
        sequelize: sequelizeInstance,
        modelName: 'Rent',
        tableName: 'Rents',
        updatedAt: 'lastUpdated',
      }
    );
  }

  /**
   * @param {import('../../car/model/carModel')} CarModel
   * @param {import('../../client/model/clientModel')} ClientModel
   */
  static setAssociations(CarModel, ClientModel) {
    RentModel.belongsTo(CarModel, {
      foreignKey: {
        name: 'fkCarId',
        field: 'fk_car_id',
      },
      as: 'Car',
    });

    RentModel.belongsTo(ClientModel, {
      foreignKey: {
        name: 'fkClientId',
        field: 'fk_client_id',
      },
      as: 'Client',
    });
  }
}

module.exports = RentModel;
