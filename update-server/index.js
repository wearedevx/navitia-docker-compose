const express = require("express");
const bodyParser = require("body-parser");

const updater = require("./src/index");

const app = express();

app.use(bodyParser.json());

function simpleAuthCheck(req, res, next) {
  const { AUTH_TOKEN } = process.env;

  const token = (req.headers.authorization || "").replace("Bearer ", "");

  if (!token || token === "" || token !== AUTH_TOKEN) {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
}

app.use(simpleAuthCheck);

// The actual request handler
app.post("/update", (req, res) => {
  updater(req, res);
});

const port = process.argv[2] || 5000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
