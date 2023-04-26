const baseUrl = function (req, res, next) {
  let protocol = req.secure ? "https" : "http";
  const hostname = req.headers.host;

  if (hostname.includes("out-class.org")) protocol = "https";
  req.base_url = `${protocol}://${hostname}`;
  next();
};

module.exports = {
  baseUrl,
};
