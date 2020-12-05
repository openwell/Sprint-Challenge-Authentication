const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const configureRoutes = require("../config/routes.js");
require('dotenv').config()

const server = express();

server.use(helmet());
server.use(cors(), logger);
server.use(express.json());

configureRoutes(server);
function logger(req, res, next) {
  console.log(req.method, req.url, Date.now());
  next();
}
server.all("*", (req, res) => {
  res.status(404).json("Sorry No Such Location");
});

module.exports = server;
