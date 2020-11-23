const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/calif", (req, res) => {
  res.render("asp/calif");
});

router.get("/ask", (req, res) => {
  res.render("asp/ask");
});

router.post("/ask", async (req, res) => {
  try {
    const nombre = req.body.nombre;
    const pregunta = req.body.pregunta;
    const email = req.body.email;
    const data = [pregunta, email, nombre];
    const query =
      "INSERT INTO preguntasinbox (pregunta,correo,estado,nombre) VALUES ($1, $2,'pendiente',$3)";
    const rest = await pool.query(query, data);
    req.flash("success", "La pregunta ha sido enviada con exito!");
    res.redirect("/ask");
  } catch (e) {
    console.log("Error ask ", e);
  }
});
module.exports = router;
