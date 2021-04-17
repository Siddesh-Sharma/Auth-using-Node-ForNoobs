const express = require("express");
const volleyball = require("volleyball");

const app = express();

app.use(volleyball);

app.use(express.json());

const auth = require("./auth/index.js");

app.get("/", (req, res) => {
  res.json({
    message: "Ehh yeaaa",
  });
});

app.use("/auth", auth);

function notfound(req, res, next) {
  res.status(404);
  const error = new Error("not found", +req.orignalURL);
  next(error);
}

function errorhandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.msg,
    stack: err.err,
  });
}

app.use(notfound);
app.use(errorhandler);

const Port = process.env.PORT || 5000;
app.listen(Port, () => {
  console.log("listening on ", Port);
});
