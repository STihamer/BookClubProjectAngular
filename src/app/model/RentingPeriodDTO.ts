export class RentingPeriodDTO {

  id: number = 0;
  rentingPeriod: number = 0;

  static fromHttp(rentingPeriod: RentingPeriodDTO): RentingPeriodDTO {
    const newRentingPeriod = new RentingPeriodDTO();
    newRentingPeriod.id = rentingPeriod.id;
    newRentingPeriod.rentingPeriod = rentingPeriod.rentingPeriod;

    return rentingPeriod;
  }

}
