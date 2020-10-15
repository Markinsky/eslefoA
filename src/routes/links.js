const express = require("express");
const router = express.Router();

const pool = require("../db");

router.get("/add", (req, res) =>{
    res.render("links/add");
});

router.post("/add", async(req, res) =>{
    const {nombre, apPat, apMat, nacimiento, contraA, contraB, email, numero} = req.body;
    const newUsser = {
        nombre,
        apPat,
        apMat,
        nacimiento,
        contraA,
        contraB,
        email,
        numero
    };
    await pool.query("INSERT INTO aspirante set ?",[newUsser]);
    res.send("Recibido uwu");
});

router.get("/register", (req, res) =>{
    res.render("links/register");
});
module.exports = router;