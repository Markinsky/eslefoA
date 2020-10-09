const express = require("express");
const morgan = require("morgan");
const app = express();

//Configuraciones
app.set("port", process.env.PORT || 3500);
//Midleware
app.use(morgan("dev"));
//Global

//Rutas
app.use(require("./routes/"));
//Public

//Servidor
app.listen(app.get("port"),()=>{
console.log("server en ", app.get("port"));
});