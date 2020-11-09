const express = require("express");
const morgan = require("morgan");
const exhbs = require("express-handlebars");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

var pg = require("pg");
var pgSession = require("connect-pg-simple")(session);

var pgPool = new pg.Pool({
  user: "postgres",
  password: "7734",
  database: "eslefodb",
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
    helpers: require("./lib/handlebars"),
  })
);
app.set("view engine", ".hbs");

//Midleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//Global
app.use(
  session({
    store: new pgSession({
      pool: pgPool, // Connection pool
      tableName: "cookie", // Use another table-name than the default "session" one
    }),
    secret: "usserSession",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  })
);

app.use((req, res, next) => {
  app.locals.success = req.flash("success");
  app.locals.error = req.flash("error");
  next();
});
//Rutas
app.use(require("./routes/"));
app.use(require("./routes/authentication"));
app.use("/links", require("./routes/links"));

//Public
app.use(express.static(path.join(__dirname, "public")));

//Servidor
app.listen(app.get("port"), () => {
  console.log("server en ", app.get("port"));
});
