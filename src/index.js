const express = require("express");
const morgan = require("morgan");
const app = express();
const exhbs = require("express-handlebars");
const path = require("path");

//Configuraciones
app.set("port", process.env.PORT || 3500);
app.set("views", path.join(__dirname,"views"))
app.engine(".hbs", exhbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"),"layouts"),
    partialsDir: path.join(app.get("views"),"partials"),
    extname: ".hbs",
    helpers: require("./lib/handlebars")
}))
app.set("view engine", ".hbs");

//Midleware
app.use(morgan("dev"));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
//Global
app.use((req, res, next) =>{
next();
});

//Rutas
app.use(require("./routes/"));
app.use(require("./routes/auth"));
app.use("/links", require("./routes/links"));

//Public
app.use(express.static(path.join(__dirname, "public")));

//Servidor
app.listen(app.get("port"),()=>{
console.log("server en ", app.get("port"));
});