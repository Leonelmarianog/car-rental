const { Model, DataTypes } = require('sequelize');

class ReservationModel extends Model {
  /**
   * @param {import('sequelize').Sequelize} sequelizeInstance
   */
  static setup(sequelizeInstance) {
    ReservationModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        pricePerDay: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        finishDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        totalPrice: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        paymentMethod: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      },
      {
        sequelize: sequelizeInstance,
        modelName: 'Reservation',
        tableName: 'Reservations',
        underscored: true,
        paranoid: true,
      }
    );

    return ReservationModel;
  }

  /**
   * @param {import('../../car/model/car.model').CarModel} CarModel
   * @param {import('../../user/model/user.model').UserModel} UserModel
   */
  static setAssociations(CarModel, UserModel) {
    CarModel.hasMany(ReservationModel, {
      foreignKey: { name: 'fkCarId', field: 'fk_car_id' },
      constraints: false,
    });
    ReservationModel.belongsTo(CarModel, {
      foreignKey: { name: 'fkCarId', field: 'fk_car_id' },
      constraints: false,
    });
    UserModel.hasMany(ReservationModel, {
      foreignKey: { name: 'fkUserId', field: 'fk_user_id' },
      constraints: false,
    });
    ReservationModel.belongsTo(UserModel, {
      foreignKey: { name: 'fkUserId', field: 'fk_user_id' },
      constraints: false,
    });

    return ReservationModel;
  }
}

module.exports = { ReservationModel };
