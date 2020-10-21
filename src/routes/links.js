const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/add", (req, res) =>{
    res.render("links/add");
});

router.post("/add", async (req, res) =>{
    try{
    const nombre = req.body.nombre;
    const apPat = req.body.apPat;
    const apMat = req.body.apMat;
    const nacimiento = req.body.nacimiento;
    const numero = req.body.numero;
    const email = req.body.email;
    const passA = req.body.contraA;
    const passB = req.body.contraB;
    var numeroLenght = numero.length;
    if(passA != passB){
        console.log("Contraseña erronea");
    }else{
        if(numeroLenght==10){
            const yy = [
                nombre,
                apPat,
                apMat,
                nacimiento,
                numero,
                email,
            ];
            const ww =[
                email,
                passA,
                id,
            ];
            //const qq = "INSERT INTO aspirante(nombre,appat,apmat,birthday,numero,correo) values ($1, $2, $3, $4, $5, $6)";
            //const qq = "INSERT INTO login(usser, pass,id,funcion) values ($1, $2, $3,'aspirante')";
            //const efe = await pool.query(qq, yy);
        }else{
           console.log("Error")
            
        }
    }
    }catch(e){
        console.log("catch:", e)
    }
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

const lastID = async(req, res) =>{
    const queryGet = 'SELECT id_aspirante from aspirante ORDER BY id_aspirante DESC LIMIT 1;';
    try{
        const { rows } = await dbQuery.query(queryGet);
        const id = rows;
    }catch(e){

    }
};

module.exports = router;