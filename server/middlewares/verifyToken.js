const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  let token;
  if (req.headers["authorization"]) {
    token = req.headers["authorization"].split(" ")[1];
  } else {
    return res.json({ auth: false, message: "failed to authenticate" });
  }

  if (!token) {
    res.send({ auth: false, message: "no token" });
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: "failed to authenticate" });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};

module.exports = { verifyJWT };
