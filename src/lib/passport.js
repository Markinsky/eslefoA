const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const pool = require("../db");
const helpers = require ("../lib/helpers");

passport.use("local.signup", new LocalStrategy({
    usernameField: "usuario",
    passwordField: "contraA",
    passReqToCallback : true
}, async (req, usuario, contraA, done) =>{
    try{
        const nombre = req.body.nombre;
        const apPat = req.body.apPat;
        const apMat = req.body.apMat;
        const nacimiento = req.body.nacimiento;
        const numero = req.body.numero;
        const email = req.body.email;
        const passA = contraA;
        const passB = req.body.contraB;
        const usser = req.body.usuario;
        const funcion = "aspirante";
        var numeroLenght = numero.length;
        const codigo = await newCode();
        var verE = await verEmail(email);
        var verU = await verUsser(usser);
        if(passA != passB || verE === false || verU===false){
            console.log("Contraseña erronea, correo repetido o usuario invalido");
        }else{
            if(numeroLenght==10){
                const pass = passA;
                const yy = [
                    nombre,
                    apPat,
                    apMat,
                    nacimiento,
                    numero,
                    email,
                    codigo
                ];
            const qq = "INSERT INTO aspirante(nombre,appat,apmat,birthday,numero,correo, codigo) values ($1, $2, $3, $4, $5, $6, $7)";
            const efeA = await pool.query(qq, yy);
            const id = await lastID();
                const login ={
                    usser,
                    pass,
                    id,
                    funcion
                };
                login.pass = await helpers.encrypt(pass);
                const pp = await pool.query("INSERT INTO login SET ?", [login]);
                login.id_login = pp.id_login;
                return done(null, login);
            }else{
               console.log("Error tamaño e.e", e)
                
            }
        }
        }catch(e){
            console.log("catch:", e)
        }
}));

passport.serializeUser((user, done) =>{
    done (null, user.id_login);
    console.log("done: ", done);
});

passport.deserializeUser(async(id_login, done) =>{
    console.log("id dese", id_login);
   const row = await pool.query("SELECT * FROM login WHERE id = ?", [id_login]);
   console.log("ROW ALGO:", rows);
   console.log("ROW ROW" , rows[0]);
   done(null, rows[0]);
});

const lastID = async(req, res) =>{
    try{
        const queryGet = await pool.query('SELECT id_aspirante from aspirante ORDER BY id_aspirante DESC LIMIT 1;');
        const id = queryGet.rows[0].id_aspirante;
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
        return code;
    }catch(e){
        console.log("error newCode", e)
    }
};

var verEmail = async(email) =>{
    try{
        const query = ('SELECT count(*) from aspirante where correo = $1;');
        const correo = [email];
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

var verUsser = async(usuario) =>{
    try{
        const query = ('SELECT count(*) from login where usser = $1;');
        const usser = [usuario];
        const qq = await pool.query(query, usser);
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
        console.log("error en el verUsser", e)
    }
};