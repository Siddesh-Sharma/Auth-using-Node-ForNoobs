const router = require("express").Router();

const db = require("../db/connection.js");
const users = db.get("users");
users.createIndex("username", { unique: true });

const Joi = require("joi");

const bcrypt = require("bcryptjs");

const schema = Joi.object({
  username: Joi.string()
    .regex(/(^[a-zA-Z0-9_]*$)/)
    .min(2)
    .max(30)
    .required(),

  password: Joi.string().trim().min(10).required(),
});

router.get("/", (req, res) => {
  res.json({
    message: "hey there iam from routes",
  });
});

router.post("/signup", (req, res, next) => {
  const result = schema.validate(req.body);

  if (result.error === undefined || null) {
    users
      .findOne({
        username: req.body.username,
      })
      .then((user) => {
        //if user is undefined, username is not in the db or dublicateuser detected
        if (user) {
          //there is already user in the db
          //respond wirth an error
          const error = new Error("user already exist");
          next(error);
        } else {
          //hash trhe pass and insert the user with the hashed password
          bcrypt.hash(req.body.password, 12).then((hashedPassword) => {
            const newUser = {
              username: req.body.username,
              password: hashedPassword,
            };

            users.insert(newUser).then((insertedUser) => {
              res.json({ insertedUser });
            });
          });
        }
      });
  } else {
    next(result.error);
  }
});

module.exports = router;
