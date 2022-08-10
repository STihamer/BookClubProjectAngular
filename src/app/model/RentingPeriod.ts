export class RentingPeriod {

  id: number = 0;
  renting_period: number = 0;

  static fromHttp(rentingPeriod: RentingPeriod): RentingPeriod {
    const newRentingPeriod = new RentingPeriod();
    newRentingPeriod.id = rentingPeriod.id;
    newRentingPeriod.renting_period = rentingPeriod.renting_period;

    return rentingPeriod;
  }

}
