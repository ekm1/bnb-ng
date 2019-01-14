const express = require("express");
const router = express.Router();
const Rental = require("../models/rental");
const User = require("../models/user");

const { normalizedErrors } = require("../helpers/mongoose");

const UserCtrl = require("../controllers/user");

router.get("/secret", UserCtrl.authMiddleware, function(req, res) {
  res.json({ secret: true });
});

router.get("/manage", UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Rental.where({ user: user })
    .populate("bookings")
    .exec(function(err, foundRentals) {
      if (err) {
        return res.status(422).send({ errors: normalizedErrors(err.errors) });
      }

      return res.json(foundRentals);
    });
});

router.get("/:id", (req, res) => {
  const rentalId = req.params.id;

  Rental.findById(rentalId)
    .populate("user", "username -_id")
    .populate("bookings", "startAt endAt -_id")
    .exec(function(err, foundRentals) {
      if (err) {
        return res.status(422).send({
          errors: [{ title: "Rental Error!", detail: "Couldnt find rental!" }]
        });
      }
      return res.json(foundRentals);
    });
});

router.get("/admin/manage", UserCtrl.adminAuthMiddleware, (req, res) => {
  Rental.find({})
    .select("")
    .exec(function(err, foundRentals) {
      if (err) {
        return res.status(422).send({ errors: normalizedErrors(err.errors) });
      }

      return res.json(foundRentals);
    });
});

router.delete("/:id", UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Rental.findById(req.params.id)
    .populate("user", "_id")
    .populate({
      path: "bookings",
      select: "startAt",
      match: { startAt: { $gt: new Date() } }
    })
    .exec(function(err, foundRental) {
      if (err) {
        return res.status(422).send({ errors: normalizedErrors(err.errors) });
      }
      if (user.id !== foundRental.user.id) {
        return res.status(422).send({
          errors: [
            { title: "Invalid User!", detail: "You don't own this rental!" }
          ]
        });
      }
      if (foundRental.bookings.length > 0) {
        return res.status(422).send({
          errors: [
            {
              title: "Active Bookings!",
              detail: "Can't delete rental with active bookings!"
            }
          ]
        });
      }
      foundRental.remove(function(err) {
        if (err) {
          return res.status(422).send({ errors: normalizedErrors(err.errors) });
        }
        return res.json({ status: "deleted" });
      });
    });
});

router.post("", UserCtrl.authMiddleware, function(req, res) {
  const {
    title,
    city,
    street,
    category,
    image,
    shared,
    bedrooms,
    description,
    dailyRate
  } = req.body;
  const user = res.locals.user;

  const rental = new Rental({
    title,
    city,
    street,
    category,
    image,
    shared,
    bedrooms,
    description,
    dailyRate
  });
  rental.user = user;
  Rental.create(rental, function(err, newRental) {
    if (err) {
      return res.status(422).send({ errors: normalizedErrors(err.errors) });
    }

    User.updateOne(
      { _id: user.id },
      { $push: { rentals: newRental } },
      function() {}
    );

    return res.json(newRental);
  });
});

router.get("", (req, res) => {
  const city = req.query.city;
  const query = city ? { city: city.toLowerCase() } : {};

  Rental.find(query)
    .select("-bookings")
    .exec((err, foundRentals) => {
      if (err) {
        return res.status(422).send({ errors: normalizedErrors(err.errors) });
      }
      if (city && foundRentals.length === 0) {
        return res.status(422).send({
          errors: [
            {
              title: "Rentals Error!",
              detail: `There are no rentals for city ${city}`
            }
          ]
        });
      }

      return res.json(foundRentals);
    });
});
module.exports = router;
