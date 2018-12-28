const Rental = require("./models/rental");

class fakeDb {
  constructor() {
    this.rentals = [
      {
        title: "Nice view on ocean",
        city: "New York",
        street: "Time Square",
        category: "small",
        image:
          "https://media.equityapartments.com/images/q_50/f_auto/fl_lossy/2293-3/the-reserve-at-eisenhower-apartments-building",
        bedrooms: 4,
        shared: true,
        description: "Vey nice",
        dailyRate: 43
      },
      {
        title: "Nice view on ocean",
        city: "New York",
        street: "Main Street",
        category: "condo",
        image:
          "https://media.equityapartments.com/images/q_50/f_auto/fl_lossy/2293-3/the-reserve-at-eisenhower-apartments-building",
        bedrooms: 4,
        shared: true,
        description: "Vey nice",
        dailyRate: 43
      },
      {
        title: "Nice view on ocean",
        city: "New York",
        street: "Main Street",
        category: "condo",
        image:
          "https://media.equityapartments.com/images/q_50/f_auto/fl_lossy/2293-3/the-reserve-at-eisenhower-apartments-building",
        bedrooms: 4,
        shared: true,
        description: "Vey nice",
        dailyRate: 43
      }
    ];
  }
  async cleanDb() {
    await Rental.deleteMany({});
  }

  pushRentalsToDb() {
    this.rentals.forEach(rental => {
      const newRental = new Rental(rental);

      newRental.save();
    });
  }

  seeDb() {
    this.cleanDb();
    this.pushRentalsToDb();
  }
}

module.exports = fakeDb;
