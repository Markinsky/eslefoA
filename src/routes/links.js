const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/add", (req, res) =>{
    res.render("links/add");
});

router.post("/add", async (req, res) =>{
  
});

router.get("/register", (req, res) =>{
    res.render("links/register");
});

router.post("/register", async(req, res)=>{
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
        const id = lastID();
        const codigo = newCode();
        var verE = verEmail();
        console.log("bere", verE)
        if(passA != passB || verE === false){
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
                    codigo
                ];
                const ww =[
                    email,
                    passA,
                    id,
                ];
               const qq = "INSERT INTO aspirante(nombre,appat,apmat,birthday,numero,correo, codigo) values ($1, $2, $3, $4, $5, $6)";
                const pp = "INSERT INTO login(usser, pass,id,funcion) values ($1, $2, $3,'aspirante')";
                const efeA = await pool.query(qq, yy);
                const efeB = await pool.query(pp, ww);
            }else{
               console.log("Error")
                
            }
        }
        }catch(e){
            console.log("catch:", e)
        }
});
router.get("/faq", (req, res) =>{
    res.render("links/faq");
});
router.get("/login", (req, res) =>{
    res.render("links/login");
});

const lastID = async(req, res) =>{
    try{
        const queryGet = await pool.query('SELECT id_aspirante from aspirante ORDER BY id_aspirante DESC LIMIT 1;');
        const id = queryGet.rows;
        return id;
    }catch(e){
        console.log("error lastId", e)
    }
};

const newCode = async(req,res) =>{
    try{
        const getCode = await pool.query('SELECT codigo from aspirante ORDER BY id_aspirante DESC LIMIT 1');
        var count = getCode.rows[0].codigo;
        var sum = parseInt(count);
        var code = sum + 1;
        return code +1;
    }catch(e){
        console.log("error newCode", e)
    }
};

const verEmail = async(req, res) =>{
    try{
        const query = ('SELECT count(*) from aspirante where correo = $1;');
        const correo = [ email];
        const qq = await pool.query(query, correo);
        var count = qq.rows[0].count;
        var res = parseInt(count);
        if(res != 0){
            //console.log("Mas de uno" , res);
            return false;
        }else{
            //console.log("Resultado:" , res);
            return true;
        }   
    }catch(e){
        console.log("error en el verEmail", e)
    }
};
module.exports = router;