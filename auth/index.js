const router = require("express").Router();

const db = require("../db/connection.js");
const users = db.get("users");
users.createIndex("username", { unique: true });

const Joi = require("joi");

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
        res.json({ user });
      });
  } else {
    next(result.error);
  }
});

module.exports = router;
