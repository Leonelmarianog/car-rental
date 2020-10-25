const { Model, DataTypes } = require('sequelize');

class CarModel extends Model {
  /**
   * @param {import('sequelize').Sequelize} sequelizeInstance
   */
  static setup(sequelizeInstance) {
    CarModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        brand: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        model: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        year: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        kmh: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        color: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        airConditioner: {
          field: 'air_conditioner',
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        passengers: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        transmission: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        pricePerDay: {
          field: 'price_per_day',
          type: DataTypes.REAL,
          allowNull: false,
        },
      },
      {
        sequelize: sequelizeInstance,
        modelName: 'Car',
        tableName: 'Cars',
        updatedAt: 'lastUpdated',
      }
    );
  }
}

module.exports = CarModel;
