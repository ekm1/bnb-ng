const User = require("../models/user");
const { normalizedErrors } = require("../helpers/mongoose");
const jwt = require("jsonwebtoken");
const config = require("../config/dev");

exports.auth = (req, res) => {
  const { email, password } = req.body;

  if (!password || !email) {
    return res.status(422).send({
      errors: [
        { title: "Data missing!", detail: "Provide email and password!" }
      ]
    });
  }

  User.findOne({ email }, function(err, user) {
    if (err) {
      return res.status(422).send({ errors: normalizedErrors(err.errors) });
    }
    if (!user) {
      return res.status(422).send({
        errors: [{ title: "User Invalid!", detail: "User doesn't exist!" }]
      });
    }
    if (user.hasSamePassword(password)) {
      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username
        },
        config.SECRET,
        { expiresIn: "1h" }
      );
      return res.json(token);
    } else {
      return res.status(422).send({
        errors: [{ title: "Wrong Data!", detail: "Wrong email or password!" }]
      });
    }
  });
};

exports.register = (req, res) => {
  const { username, email, password, passwordConfirmation } = req.body;

  if (!password || !email) {
    return res.status(422).send({
      errors: [
        { title: "Data missing!", detail: "Provide email and password!" }
      ]
    });
  }

  if (password !== passwordConfirmation) {
    return res.status(422).send({
      errors: [
        { title: "Invalid Password!", detail: "Password doesn't match!" }
      ]
    });
  }
  User.findOne({ email }, (err, existingUser) => {
    if (err) {
      return res.status(422).send({ errors: normalizedErrors(err.errors) });
    }
    if (existingUser) {
      return res.status(422).send({
        errors: [
          {
            title: "Invalid Email!",
            detail: "User with this email already exists!"
          }
        ]
      });
    }
    const user = new User({
      username,
      email,
      password
    });
    user.save(err => {
      if (err) {
        return res.status(422).send({ errors: normalizedErrors(err.errors) });
      }
      return res.json({ registered: true });
    });
  });
};

exports.authMiddleware = function(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    const user = parseToken(token);

    User.findById(user.userId, function(err, user) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }

      if (user) {
        res.locals.user = user;
        next();
      } else {
        return notAuthorized(res);
      }
    });
  } else {
    return notAuthorized(res);
  }
};
exports.adminAuthMiddleware = function(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    const user = parseToken(token);

    User.findById(user.userId, function(err, user) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }

      if (user && user.isAdmin) {
        res.locals.user = user;
        next();
      } else {
        return notAuthorized(res);
      }
    });
  } else {
    return notAuthorized(res);
  }
};

exports.getAllUsers = function(req, res) {
  User.find({})
    .select("-bookings -rentals -password -isAdmin  -_id")
    .exec(function(err, foundUsers) {
      if (err) {
        return res.status(422).send({ errors: normalizedErrors(err.errors) });
      }

      return res.json(foundUsers);
    });
};

function parseToken(token) {
  return jwt.verify(token.split("Bearer")[1], config.SECRET);
}
function notAuthorized(res) {
  return res.status(401).send({
    errors: [
      { title: "Not Authorized!", detail: "You need to login to get access!" }
    ]
  });
}
