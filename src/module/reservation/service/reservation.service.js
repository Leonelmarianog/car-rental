const { NotDefinedException } = require('../../common/exception');

class ReservationService {
  /**
   * @param {import('../repository/reservation.repository').ReservationRepository} reservationRepository
   * @param {import('../../car/repository/car.repository').CarRepository} carRepository
   */
  constructor(reservationRepository, carRepository) {
    this.reservationRepository = reservationRepository;
    this.carRepository = carRepository;
  }

  /**
   * @returns {Promise<Array<import('../entity/reservation.entity').Reservation>>}
   */
  async getAll() {
    const reservations = await this.reservationRepository.getAll();
    return reservations;
  }

  /**
   * @param {Number} id
   * @returns {Promise<import('../entity/reservation.entity').Reservation>}
   */
  async getById(id) {
    if (!id) {
      throw new NotDefinedException('A valid id is required to realize this action.');
    }

    const reservation = await this.reservationRepository.getById(id);
    return reservation;
  }

  /**
   * @param {import('../entity/reservation.entity').Reservation} reservation
   * @returns {Promise<import('../entity/reservation.entity').Reservation>}
   */
  async save(reservation) {
    if (!reservation) {
      throw new NotDefinedException('A defined reservation is required to realize this action.');
    }

    const car = await this.carRepository.getById(reservation.fkCarId);
    reservation.reserve(car);

    const savedReservation = await this.reservationRepository.save(reservation);
    return savedReservation;
  }

  /**
   * @param {Number} id
   * @returns {Promise<Boolean>}
   */
  async delete(id) {
    if (!id) {
      throw new NotDefinedException('A valid id is required to realize this action.');
    }

    const isDeleted = await this.reservationRepository.delete(id);
    return isDeleted;
  }

  /**
   * @param {import('../entity/reservation.entity').Reservation} reservation
   * @returns {Promise<import('../entity/reservation.entity').Reservation>}
   */
  async pay(reservation) {
    if (!reservation) {
      throw new NotDefinedException('A defined reservation is required to realize this action.');
    }

    const paidReservation = reservation.pay();

    const savedReservation = await this.reservationRepository.save(paidReservation);
    return savedReservation;
  }

  /**
   * @param {import('../entity/reservation.entity').Reservation} reservation
   * @returns {Promise<import('../entity/reservation.entity').Reservation>}
   */
  async finish(reservation) {
    if (!reservation) {
      throw new NotDefinedException('A defined reservation is required to realize this action.');
    }

    const finishedReservation = reservation.finish();

    const savedReservation = await this.reservationRepository.save(finishedReservation);
    return savedReservation;
  }

  /**
   * @param {import('../entity/reservation.entity').Reservation} reservation
   * @returns {Promise<import('../entity/reservation.entity').Reservation>}
   */
  async reset(reservation) {
    if (!reservation) {
      throw new NotDefinedException('A defined reservation is required to realize this action.');
    }

    const resetReservation = reservation.reset();

    const savedReservation = await this.reservationRepository.save(resetReservation);
    return savedReservation;
  }
}

module.exports = { ReservationService };
