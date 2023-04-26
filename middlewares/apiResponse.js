module.exports = function (req, res, next) {
  res.SUCCESS = "success";
  res.ERROR = "error";
  res.sendApiResponse = ({
    status = 200,
    message = "",
    data = null,
    type = res.SUCCESS,
  }) => {
    const responseObj = {
      status,
      type,
    };

    if (data) responseObj.data = data;

    if (status < 200 || status > 299) responseObj.type = res.ERROR;

    if (message) responseObj.message = message;

    return res.status(status).send(responseObj);
  };
  next();
};
