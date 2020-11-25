const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/newcurso", async (req, res) => {
  const master = await pool.query(
    "SELECT nombre, appat from aspirante WHERE funcion = 'maestro';"
  );
  const maestro = master.rows[0].nombre;
  var out = [];
  for (var i = 0; i < master.rowCount; i++) {
    var nombre = master.rows[i].nombre;
    var apellido = master.rows[i].appat;
    out[i] = nombre + " " + apellido;
  }
  var jsonArray = JSON.parse(JSON.stringify(out));
  res.render("admin/cursos", { maestros: jsonArray });
});

router.post("/newcurso", async (req, res) => {
  try {
  } catch (e) {
    console.log("ERROR NEW CURSO", e);
  }
});

router.get("/verasp", async (req, res) => {
  const ver = await pool.query(
    "SELECT * FROM login as l INNER JOIN aspirante as x ON l.id_aspirante = x.id_aspirante AND x.id_aspirante = l.id_aspirante AND funcion = 'aspirante'"
  );
  const hola = ver.rows;
  res.render("admin/verp", { hola });
});

router.get("/adminpreg", async (req, res) => {
  const pregjson = await pool.query(
    "SELECT * FROM preguntasinbox WHERE estado = 'pendiente';"
  );
  const preg = pregjson.rows;
  res.render("admin/preg", { preg });
});
module.exports = router;
