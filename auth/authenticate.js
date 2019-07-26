const jwt = require("jsonwebtoken");
const db = require('../database/user-model')

const jwtKey =
  process.env.JWT_SECRET ||
  "add a .env file to root of project with the JWT_SECRET variable";

// quickly see what this file exports
module.exports = {
  authenticate,
  myBcrypt,
  compareMyBcrypt,
  validateUser,
  validateUserPassword
};

// implementation details
function authenticate(req, res, next) {
  const token = req.get("Authorization");
  if (token) {
    jwt.verify(token, jwtKey, (err, decoded) => {
      if (err) return res.status(401).json(err);
      req.decoded = decoded;
      next();
    });
  } else {
    return res.status(401).json({
      error: "No token provided, must be set on the Authorization Header"
    });
  }
}

function myBcrypt(
  password,
  cycle = 10,
  salt = new Date().getTime().toString()
) {
  let hashed = md5(salt + password);
  for (let i = 0; i < cycle; i++) {
    hashed = md5(hashed);
  }
  const encodedSalt = Buffer.from(salt).toString("base64");
  const encodedHash = Buffer.from(hashed).toString("base64");
  return `md5$${cycle}$${encodedSalt}$${encodedHash}`;
}

function compareMyBcrypt(rawPassword, naiveBcryptHash) {
  const [, rounds, encodedSalt] = naiveBcryptHash.split("$");
  const salt = Buffer.from(encodedSalt, "base64").toString("ascii");
  return myBcrypt(rawPassword, Number(rounds), salt) === naiveBcryptHash;
}

function validateUser(req, res, next) {
  const { username, password } = req.body;
  if (!req.body) {
    return res.status(400).json({
      message: "missing user data"
    });
  } else if (!username || username.trim().length < 1) {
    return res.status(400).json({
      message: "missing required username field"
    });
  } else if (!password || password.trim().length < 1) {
    return res.status(400).json({
      message: "missing required password field"
    });
  }
  next();
}

async function validateUserPassword(req, res, next) {
  const { username, password } = req.body;
  try {
    let userData = await db.getByUsername(username);
    let compareOutput = compareMyBcrypt(password, userData.password);
    if (!compareOutput) {
      return res.status(401).json({ error: "Incorrect Password" });
    }
    req.session.user = userData;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Incorrect Username" });
  }
}
