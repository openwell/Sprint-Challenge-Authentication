const axios = require("axios");
const db = require('../database/user-model')

const {
  authenticate,
  myBcrypt,
  validateUser
} = require("../auth/authenticate");

module.exports = server => {
  server.post("/api/register", validateUser, register);
  server.post("/api/login", validateUser, validateUserPassword, login);
  server.get("/api/jokes", authenticate, getJokes);
};

function register(req, res) {
  // implement user registration
  const { username, password } = req.body;
  const data = {
    username: username,
    password: myBcrypt(password, 10)
  };
  db.createUser(data)
    .then(dbResponse => {
      return res.status(200).json({
        data: dbResponse
      });
    })
    .catch(err => {
      if(err.code === "SQLITE_CONSTRAINT"){
        return res.status(500).json({error: 'Username Already Exit'});
      }
      res.status(500).send(err);
    });
}

function login(req, res) {
  // implement user login
  res.status(200).json({message: 'Welcome'})
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: "application/json" }
  };

  axios
    .get("https://icanhazdadjoke.com/search", requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: "Error Fetching Jokes", error: err });
    });
}
