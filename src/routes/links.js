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
    const calificacion = req.body.calificacion;
    const respuesta = req.body.respuesta || "nulo";
    const check = req.body.check || "nulo";
    if (calificacion) {
      req.flash("error", "Error!");
      return null;
    } else {
      const data = [calificacion, respuesta, check];
      const query =
        "INSERT INTO encuestainbox (calificacion, respuesta, checkbox) VALUES ($1, $2, $3)";
      const res = await pool.query(query, data);
    }
  } catch (e) {
    console.log("Error post encuesta", e);
  }
});

module.exports = router;
