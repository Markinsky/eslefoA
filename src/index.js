const express = require("express");
const morgan = require("morgan");
const exhbs = require("express-handlebars");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
var pg = require("pg");
var pgSession = require("connect-pg-simple")(session);
var { pool } = require("./keys");
var moment = require("moment");

var pgPool = new pg.Pool({
  host: "localhost",
  user: "postgres",
  password: "7734",
  database: "eslefodb",
  port: 5432,
});

//init
const app = express();
require("./lib/passport");
//Configuraciones
app.set("port", process.env.PORT || 3500);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exhbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: {
      eq(dato, funcion) {
        if (dato == funcion) {
          return true;
        } else {
          return false;
        }
      },
      formatdate: function (date, format) {
        var mmnt = moment(date);
        return mmnt.format(format);
      },
      fulldata: function (data) {
        console.log("Data helper", data);
        return data;
      },
    },
  })
);
app.set("view engine", ".hbs");

//Midleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());

//Global
app.use(
  session({
    secret: "SECRETO",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  app.locals.user = req.user;
  app.locals.success = req.flash("success");
  app.locals.error = req.flash("error");
  //console.log("Req user", req.user);
  next();
});
//Rutas
app.use(require("./routes/"));
app.use(require("./routes/authentication"));
app.use(require("./routes/aspirante"));
app.use(require("./routes/maestro"));
app.use(require("./routes/admin"));
app.use("/links", require("./routes/links"));

//Public
app.use(express.static(path.join(__dirname, "public")));

//Servidor
app.listen(app.get("port"), () => {
  console.log("server en ", app.get("port"));
});
