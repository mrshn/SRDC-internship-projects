const checkAdmin = (req, res, next) => {
    const privilege = req.user.privilege;
  
    if (privilege!==(-1)) {
      return next();
    } else {
      return res.status(403).send("You are not an ADMIN!");
    }
  };
  
  module.exports = checkAdmin;
  