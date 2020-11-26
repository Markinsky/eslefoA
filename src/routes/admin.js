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

router.get("/verasp/edit/:id_aspirante", async (req, res) => {
  const { id_aspirante } = req.params;
  const search = await pool.query(
    "SELECT l.usser,l.id_aspirante,x.nombre, x.appat, x.apmat, x.numero  FROM login as l INNER JOIN aspirante as x ON l.id_aspirante = $1 AND x.id_aspirante = $1 AND funcion = 'aspirante'",
    [id_aspirante]
  );
  const returnasp = search.rows[0];
  res.render("admin/editasp", { returnasp });
});

router.post("/verasp/edit/:id_aspirante", async (req, res) => {
  const { id_aspirante } = req.params;
  const { nombre, apPat, apMat, numero, email, nacimiento } = req.body;
  const editquery = await pool.query(
    "UPDATE aspirante SET nombre = $1, appat=$2, apmat=$3, birthday=$4,numero=$5 WHERE id_aspirante = $6",
    [nombre, apPat, apMat, nacimiento, numero, id_aspirante]
  );
  const editlogin = await pool.query(
    "UPDATE login SET usser = $1 WHERE id_aspirante = $2",
    [email, id_aspirante]
  );
  res.redirect("/verasp");
});

router.get("/adminpreg", async (req, res) => {
  const pregjson = await pool.query(
    "SELECT * FROM preguntasinbox WHERE estado = 'pendiente';"
  );
  const preg = pregjson.rows;
  res.render("admin/preg", { preg });
});
module.exports = router;
