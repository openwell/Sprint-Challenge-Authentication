const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const configureRoutes = require("../config/routes.js");

const server = express();

server.use(helmet());
server.use(cors(), logger);
server.use(express.json());

configureRoutes(server);
function logger(req, res, next) {
  console.log(req.method, req.url, Date.now());
  next();
}

module.exports = server;
