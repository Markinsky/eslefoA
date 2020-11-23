const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/newcurso", (req, res) => {
  res.render("admin/cursos");
});
module.exports = router;
