const { AuthSession } = require("../models/AuthSession");
const jwt = require("jsonwebtoken");
const config = require("config");

module.exports.authorize = (
  allowed = "",
  options = { verifiedEmail: false, authorized: true }
) => {
  return async (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token)
      return res.status(401).send("Access denied! No token provided.");

    try {
      const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
      const authSession = await AuthSession.findOne({
        _id: decoded._id,
      }).populate("user");

      if (
        !authSession || // if there is no entry of auth session
        authSession.isExpired || // if token is expired
        typeof authSession.user !== "object" // if user is not populated
      )
        return res.status(401).send("Access denied! Invalid token.");

      const { user } = authSession;

      const { verifiedEmail } = options;

      //email not verified
      if (verifiedEmail && user.isEmailVerified !== true)
        return res.status(401).send("your email is not verified");

      //waddi logic ay bawa g taddi samaj nai aani.
      if (
        allowed &&
        ((typeof allowed === "string" && user.role !== allowed) ||
          (Array.isArray(allowed) && !allowed.includes(user.role)))
      )
        return res.status(403).send("You are forbidden in this area.");

      //good to go.
      req.authSession = authSession;
      next();
    } catch (ex) {
      res.status(401).send("Access denied! Invalid token.");
    }
  };
};

module.exports.authorizeIfUser = (
  allowed = "",
  options = { verifiedEmail: false, authorized: true }
) => {
  return async (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) return next();

    try {
      const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
      const authSession = await AuthSession.findOne({
        _id: decoded._id,
      }).populate("user");

      if (
        !authSession || // if there is no entry of auth session
        authSession.isExpired || // if token is expired
        typeof authSession.user !== "object" // if user is not populated
      )
        return res.status(401).send("Access denied! Invalid token.");

      const { user } = authSession;

      const { verifiedEmail } = options;

      //email not verified
      if (verifiedEmail && user.isEmailVerified !== true)
        return res.status(401).send("your email is not verified");

      //waddi logic ay bawa g taddi samaj nai aani.
      if (
        allowed &&
        ((typeof allowed === "string" && user.role !== allowed) ||
          (Array.isArray(allowed) && !allowed.includes(user.role)))
      )
        return res.status(403).send("You are forbidden in this area.");

      //good to go.
      req.authSession = authSession;
      next();
    } catch (ex) {
      next();
    }
  };
};
