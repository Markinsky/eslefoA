const express = require("express");
const router = express.Router();

const pool = require("../db");

router.get("/add", (req, res) =>{
    res.render("links/add");
});

router.post("/add", async (req, res) =>{

    const {nombre, apPat, apMat, nacimiento, contraA, contraB, email, numero} = req.body;
    const qq = "INSERT INTO aspirante (nombre, apPat, apMat, birthday, celular, correo) values ($1, $2, $3, $4, $5, $6)";
    const yy = [nombre,apPat,apMat,nacimiento,numero,email];
    const kami = pool.query = (qq, yy);
    console.log("Kami:", kami)
    pool.end;

   

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