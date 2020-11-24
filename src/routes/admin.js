const express = require("express");
const router = express.Router();
const pool = require("../db");

//router.get("/newcurso", (req, res) => {
//  res.render("admin/cursos");
//});

router.get("/verasp", async (req, res) => {
  const ver = await pool.query(
    "SELECT * FROM login as l INNER JOIN aspirante as x ON l.id_aspirante = x.id_aspirante AND x.id_aspirante = l.id_aspirante AND funcion = 'aspirante'"
  );
  const hola = ver.rows;
  const hhhh = JSON.stringify(hola);
  //console.log("hhh", hhhh);
  res.render("admin/verp", { hola, strings: hhhh });
});
module.exports = router;
