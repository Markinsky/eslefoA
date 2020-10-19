const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/add", (req, res) =>{
    res.render("links/add");
});

router.post("/add", async (req, res) =>{
    const nombre = req.body.nombre;
    const apPat = req.body.apPat;
    const apMat = req.body.apMat;
    const nacimiento = req.body.nacimiento;
    const numero = req.body.numero;
    const email = req.body.email;
    const qq = "INSERT INTO aspirante (nombre,apPaterno, apMat, birthday, numero, correo) values ($1, $2, $3, $4, $5, $6);";
    const yy = [
        nombre,
        apPat,
        apMat,
        nacimiento,
        numero,
        email,
    ];
    //console.log("log", yy);
    await pool.query(qq, yy);
    pool.end();
});

router.get("/register", (req, res) =>{
    res.render("links/register");
});

router.get("/faq", (req, res) =>{
    res.render("links/faq");
});
router.get("/login", (req, res) =>{
    res.render("links/login");
});
module.exports = router;