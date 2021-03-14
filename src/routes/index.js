const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const countAbiertos = await pool.query(
      "SELECT COUNT(*) FROM curso WHERE estado = 'abierto'"
    );
    const countCursos = await pool.query("SELECT COUNT(*) FROM curso");
    var count = countAbiertos.rows[0].count;
    var arriba = parseInt(count);
    var countB = countCursos.rows[0].count;
    var existen = parseInt(countB);
    const estero = await pool.query(
      "SELECT * FROM publi ORDER BY id_publi DESC limit 4"
    );
    const publis = estero.rows;
    res.render("index", { existen, arriba, publis });
  } catch (e) {
    console.log("Error en el index", e);
  }
});

router.post("/read/:id_publi", async (req, res) => {
  try {
    const { id_publi } = req.params;
    const aaaa = await pool.query("SELECT * FROM publi WHERE id_publi = $1", [
      id_publi,
    ]);
    const nos = aaaa.rows[0];
    res.render("publi", { nos });
  } catch (e) {
    console.log("ERROR PUBKU ", e);
  }
});

module.exports = router;
