const { fromModelToEntity } = require('../mapper/reservation.mapper');
const { NotFoundException, NotDefinedException } = require('../../common/exception');
const { Reservation } = require('../entity/reservation.entity');

class ReservationRepository {
  /**
   * @param {import('../model/reservation.model').ReservationModel} ReservationModel
   * @param {import('../../car/model/car.model').CarModel} CarModel
   * @param {import('../../user/model/user.model').UserModel).UserModel} UserModel
   */
  constructor(ReservationModel, CarModel, UserModel) {
    this.ReservationModel = ReservationModel;
    this.CarModel = CarModel;
    this.UserModel = UserModel;
  }

  /**
   * @returns {Promise<Array<import('../entity/reservation.entity').Reservation>>}
   */
  async getAll() {
    const reservationsData = await this.ReservationModel.findAll({
      include: [
        {
          model: this.CarModel,
          paranoid: false,
        },
        {
          model: this.UserModel,
          paranoid: false,
        },
      ],
    });

    const reservations = reservationsData.map((reservationData) =>
      fromModelToEntity(reservationData)
    );

    return reservations;
  }

  /**
   * @param {Number} id
   * @returns {Promise<import('../entity/reservation.entity').Reservation>}
   */
  async getById(id) {
    if (!Number(id)) {
      throw new NotDefinedException('A valid id is required to realize this action.');
    }

    const reservationData = await this.ReservationModel.findByPk(id, {
      include: [
        {
          model: this.CarModel,
          paranoid: false,
        },
        {
          model: this.UserModel,
          paranoid: false,
        },
      ],
    });

    if (!reservationData) {
      throw new NotFoundException(`Reservation #${id} not found.`);
    }

    const reservation = fromModelToEntity(reservationData);
    return reservation;
  }

  /**
   * @param {import('../entity/reservation.entity').Reservation} reservation
   * @returns {Promise<import('../entity/reservation.entity').Reservation>}
   */
  async save(reservation) {
    if (!(reservation instanceof Reservation)) {
      throw new NotDefinedException('A defined reservation is required to realize this action.');
    }

    const isUpdate = reservation.id;
    let reservationId;

    if (isUpdate) {
      const [affectedRows] = await this.ReservationModel.update(
        {
          id: reservation.id,
          fkCarId: reservation.fkCarId,
          fkUserId: reservation.fkUserId,
          pricePerDay: reservation.pricePerDay,
          startDate: reservation.startDate,
          finishDate: reservation.finishDate,
          totalPrice: reservation.totalPrice,
          paymentMethod: reservation.paymentMethod,
          status: reservation.status,
        },
        {
          where: {
            id: reservation.id,
          },
        }
      );

      if (affectedRows === 0) {
        throw new NotFoundException(`Reservation #${reservation.id} not found.`);
      }

      reservationId = reservation.id;
    } else {
      const reservationData = await this.ReservationModel.create({
        id: reservation.id,
        fkCarId: reservation.fkCarId,
        fkUserId: reservation.fkUserId,
        pricePerDay: reservation.pricePerDay,
        startDate: reservation.startDate,
        finishDate: reservation.finishDate,
        totalPrice: reservation.totalPrice,
        paymentMethod: reservation.paymentMethod,
        status: reservation.status,
      });

      reservationId = reservationData.id;
    }

    const savedReservation = await this.getById(reservationId);
    return savedReservation;
  }

  /**
   * @param {Number} id
   * @returns {Promise<Boolean>}
   */
  async delete(id) {
    if (!Number(id)) {
      throw new NotDefinedException('A valid id is required to realize this action.');
    }

    const deletedRows = await this.ReservationModel.destroy({ where: { id } });

    if (deletedRows === 0) {
      throw new NotFoundException(`Reservation #${id} not found.`);
    }

    return true;
  }
}

module.exports = { ReservationRepository };
