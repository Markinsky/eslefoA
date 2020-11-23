const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/add", (req, res) => {
  res.render("links/add");
});

router.post("/add", async (req, res) => {});

router.get("/register", (req, res) => {
  res.render("links/register");
});

router.post("/register", async (req, res) => {});

router.get("/faq", (req, res) => {
  res.render("links/faq");
});
router.get("/login", (req, res) => {
  res.render("links/login");
});

router.get("/aboutus", (req, res) => {
  res.render("links/aboutus");
});

router.get("/rules", (req, res) => {
  res.render("links/rules");
});

router.get("/encuesta", (req, res) => {
  res.render("links/encuesta");
});

router.post("/encuesta", async (req, res) => {
  try {
    const calificacion = req.body.calificacion || "nulo";
    const respuesta = req.body.respuesta || "nulo";
    const check = req.body.check || "nulo";
    console.log("Cal", calificacion);
    if (calificacion || calificacion === "nulo") {
      req.flash("error", "Error!");
      res.redirect("/links/encuesta");
    } else {
      const data = [calificacion, respuesta, check];
      const query =
        "INSERT INTO encuestainbox (calificacion, respuesta, checkbox) VALUES ($1, $2, $3)";
      const rest = await pool.query(query, data);
      req.flash("success", "Encuesta enviada con exito");
      res.redirect("/links/encuesta");
    }
  } catch (e) {
    console.log("Error post encuesta", e);
  }
});

router.get("/askus", (req, res) => {
  res.render("links/askus");
});

router.post("/askus", async (req, res) => {
  try {
    const nombre = req.body.nombre;
    const pregunta = req.body.pregunta;
    const email = req.body.email;
    const data = [pregunta, email, nombre];
    const query =
      "INSERT INTO preguntasinbox (pregunta, correo,estado,nombre) VALUES ($1, $2,'pendiente',$3)";
    const rest = await pool.query(query, data);
    req.flash("success", "La pregunta ha sido enviada con exito!");
    res.redirect("/links/askus");
  } catch (e) {
    console.log("Error askus ", e);
  }
});

module.exports = router;
