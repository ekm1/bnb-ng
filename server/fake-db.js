const Rental = require("./models/rental");
const User = require("./models/user");

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

    this.users = [
      {
        username: "Test User",
        email: "test@gmail.com",
        password: "testtest"
      },
      {
        username: "Test User1",
        email: "test1@gmail.com",
        password: "testtest1"
      }
    ];
  }
  async cleanDb() {
    await User.deleteMany({});
    await Rental.deleteMany({});
  }

  pushRentalsToDb() {
    const user = new User(this.users[0]);
    const user2 = new User(this.users[1]);

    this.rentals.forEach(rental => {
      const newRental = new Rental(rental);
      newRental.user = user;
      user.rentals.push(newRental);
      newRental.save();
    });
    user.save();
    user2.save();
  }

  async seeDb() {
    await this.cleanDb();
    this.pushRentalsToDb();
  }
}

module.exports = fakeDb;
