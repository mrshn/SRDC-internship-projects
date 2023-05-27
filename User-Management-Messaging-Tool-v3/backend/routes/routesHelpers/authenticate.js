const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).send("Token can not be null");
  }
  try {
    const decodedUser = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decodedUser;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
