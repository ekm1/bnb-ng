const Booking = require("../models/booking");
const Rental = require("../models/rental");
const User = require("../models/user");
const { normalizedErrors } = require("../helpers/mongoose");
const moment = require("moment");

exports.createBooking = function(req, res) {
  const { startAt, endAt, totalPrice, guests, days, rental } = req.body;
  const user = res.locals.user;

  const booking = new Booking({ startAt, endAt, totalPrice, guests, days });

  Rental.findById(rental._id)
    .populate("bookings")
    .populate("user")
    .exec(function(err, foundRental) {
      if (err) {
        return res.status(422).send({ errors: normalizedErrors(err.errors) });
      }
      if (foundRental.user.id === user.id) {
        return res.status(422).send({
          errors: [
            { title: "User Invalid!", detail: "You can't book your rental!" }
          ]
        });
      }

      if (isvalidBooking(booking, foundRental)) {
        booking.user = user;
        booking.rental = foundRental;
        foundRental.bookings.push(booking);

        booking.save(function(err) {
          if (err) {
            return res
              .status(422)
              .send({ errors: normalizedErrors(err.errors) });
          }
          foundRental.save();
          User.updateOne(
            { _id: user.id },
            { $push: { bookings: booking } },
            function() {}
          );
          return res.json({ startAt: booking.startAt, endAt: booking.endAt });
        });

        //update rental , update user
      } else {
        return res.status(422).send({
          errors: [
            {
              title: "Booking Invalid!",
              detail: "Choosen dates are already taken!"
            }
          ]
        });
      }
    });
};

exports.getUserBookings = function(req, res) {
  const user = res.locals.user;

  Booking.where({ user: user })
    .populate("rental")
    .exec(function(err, foundBookings) {
      if (err) {
        return res.status(422).send({ errors: normalizedErrors(err.errors) });
      }

      return res.json(foundBookings);
    });
};

exports.getAllBookings = function(req, res) {
  User.find({})
    .select("-isAdmin -rentals -email -password -_id")
    .exec(function(err, foundBookings) {
      if (err) {
        return res.status(422).send({ errors: normalizedErrors(err.errors) });
      }

      return res.json(foundBookings);
    });
};

function isvalidBooking(proposedBooking, rental) {
  let isValid = true;
  if (rental.bookings && rental.bookings.length > 0) {
    isValid = rental.bookings.every(function(booking) {
      const proposedStart = moment(proposedBooking.startAt);
      const proposedEnd = moment(proposedBooking.endAt);

      const actualStart = moment(booking.startAt);
      const actualEnd = moment(booking.endAt);

      return (
        (actualStart < proposedStart && actualEnd < proposedStart) ||
        (proposedEnd < actualEnd && proposedEnd < actualStart)
      );
    });
  }
  return isValid;
}
