const express = require("express");
const router = express.Router();

const pool = require("../db");

router.get("/add", (req, res) =>{
    res.render("links/add");
});

router.post("/add", (req, res) =>{
    const {nombre, apPat, apMat, nacimiento, contraA, contraB, email, numero} = req.body;
    const hola = pool.query("INSERT INTO aspirante (nombre, apPat, apMat, birthday, celular, correo) values ($1, $2, $3, $4, $5, $6)",[nombre,apPat,apMat,nacimiento,numero,email]);
    console.log("CONSOLA: ",hola);
    res.send("Recibido uwu");
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