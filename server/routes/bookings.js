const express = require("express");
const router = express.Router();

const UserCtrl = require("../controllers/user");
const BookingCtrl = require("../controllers/booking");

router.post("", UserCtrl.authMiddleware, BookingCtrl.createBooking);

router.get("/manage", UserCtrl.authMiddleware, BookingCtrl.getUserBookings);

router.get(
  "/admin/manage",
  UserCtrl.adminAuthMiddleware,
  BookingCtrl.getAllBookings
);

module.exports = router;
