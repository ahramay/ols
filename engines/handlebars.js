const exphbs = require("express-handlebars");
const engineOptions = {
  defaultLayout: "main",
  layoutsDir: "views/layouts",
  partialsDir: "views/partials",
  extname: "hbs",
};

console.log("LAYOUTS PATH ", engineOptions.layoutsDir);
const hbs = exphbs.create(engineOptions);

const configureHbs = (app) => {
  app.set("views", "views");

  app.engine("hbs", exphbs(engineOptions));

  app.set("view engine", "hbs");
};

module.exports = {
  hbs,
  configureHbs,
};
