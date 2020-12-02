const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  const countAbiertos = await pool.query(
    "SELECT COUNT(*) FROM curso WHERE estado = 'abierto'"
  );
  const countCursos = await pool.query("SELECT COUNT(*) FROM curso");
  var count = countAbiertos.rows[0].count;
  var arriba = parseInt(count);
  var countB = countCursos.rows[0].count;
  var existen = parseInt(countB);
  res.render("index", { existen, arriba });
});

router.post("/", (req, res) => {});

module.exports = router;
