import "core-js/stable";
import "regenerator-runtime/runtime";

const http = require("http");
const express = require("express");
require("express-async-errors");

import { matchRoutes } from "react-router-config";
import Routes from "./client/Routes";
import renderer from "./helpers/renderer";
import createServerStore from "./helpers/createServerStore";
import { setToken } from "./client/store/auth/authReducer";

const path = require("path");
//adding ability to validate objectId of mongoDB in joi
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { baseUrl } = require("./middlewares/url");
const apiResponse = require("./middlewares/apiResponse");

const { configureHbs } = require("./engines/handlebars");
//registering global exception handler
const globalExceptionHandler = require("./startup/globalExceptionHandler");
globalExceptionHandler();

//checking required configs
require("./startup/configs")();

//configuring mongoDB
require("./startup/db")();

//configuring s3 bucket
require("./startup/s3")();

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.static("dist"));
app.use(express.static("public"));
app.use(express.static("admin/build"));
//------------ ** MIDDLEWARES ** ----------//
// accepting json data
app.use(express.json());
//accepting url encoded form data
app.use(express.urlencoded({ extended: true }));

//configuring handlebars view engine
configureHbs(app);

//setting req.base_url
app.use(baseUrl);

//binding sendApiResponse
app.use(apiResponse);
//registering all the server routes
const routeRegisterer = require("./startup/routes");
routeRegisterer(app);

//------------ ** Middlewares ** ----------//

//------------ ** Admin Panel ** ----------//
app.use(express.static("admin/build"));

app.get(/admin.*/, async (req, res) => {
  res.sendFile(path.resolve("admin/build/admin.html"));
});

//------------ ** Admin Panel ** ----------//
app.get("*", (req, res) => {
  const store = createServerStore();
  //setting token
  if (req.cookies && req.cookies.xAuthToken)
    store.dispatch(setToken(req.cookies.xAuthToken));

  const loadDataPromises = matchRoutes(Routes, req.path).map((matchedRoute) => {
    const { route } = matchedRoute;

    return route.component.loadData
      ? route.component.loadData({ store, matchedRoute })
      : null;
  });

  Promise.all(loadDataPromises)
    .then(async () => {
      const context = {};
      const markup = await renderer(req, store, context);

      if (context.notFound === true) res.status(404);

      res.send(markup);
    })
    .catch((e) => {
      console.log(e);
      res.sendApiResponse({ status: 400, message: "Something Went wrong!" });
    });
});

//registering errorhandler
const { exceptionHandler } = require("./middlewares/errors");
app.use(exceptionHandler);
const server = http.createServer(app);

const port = process.env.PORT || 8080;
const { NODE_ENV } = process.env;
server.listen(port, () => {
  console.log(
    `Server is listening on port ${port} in ${NODE_ENV} environment.`
  );
});

require("./cron-jobs/subscriptionEndEmail")();
