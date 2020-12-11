const express = require("express");
const router = express.Router();
const pool = require("../db");

//Ver cursos
router.get("/cursosmaestro", async (req, res) => {
  try {
    //usa vercurso_espe uwu
  } catch (e) {
    console.log("Error ver cursos maestro", e);
  }
});
module.exports = router;
