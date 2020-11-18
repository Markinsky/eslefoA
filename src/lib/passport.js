const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const pool = require("../db");
const helpers = require("../lib/helpers");

passport.use(
  "local-signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "pass",
      passReqToCallback: true,
    },
    async (req, email, pass, done) => {
      try {
        const arra = [email];
        const queryRows =
          "SELECT count(*) FROM login WHERE usser = $1 AND funcion = 'aspirante'";
        const qq = await pool.query(queryRows, arra);
        var count = qq.rows[0].count;
        var res = parseInt(count);
        if (res > 0) {
          const queryPass =
            "SELECT * FROM login WHERE usser = $1 AND funcion = 'aspirante'";
          const bb = await pool.query(queryPass, arra);
          const passRes = bb.rows[0].pass;
          const idRes = bb.rows[0].id_aspirante;
          const validPass = await helpers.matchPass(pass, passRes);
          if (validPass) {
            const stuffy = "SELECT * FROM aspirante WHERE id_aspirante = $1";
            const ac = [idRes];
            const ussers = await pool.query(stuffy, ac);
            const user = ussers.rows[0];
            console.log("wq", user);
            return done(null, user.id_aspirante);
          } else {
            req.flash("error", "Error contraseña");
            return done(null, false);
          }
        } else {
          req.flash("error", "Error usuario");
          return done(null, false);
        }
      } catch (e) {
        console.log("Error signing" + e);
      }
    }
  )
);

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "contraA",
      passReqToCallback: true,
    },
    async (req, email, contraA, done) => {
      try {
        const nombre = req.body.nombre;
        const apPat = req.body.apPat;
        const apMat = req.body.apMat;
        const nacimiento = req.body.nacimiento;
        const numero = req.body.numero;
        const email = req.body.email;
        const passA = req.body.contraA;
        const passB = req.body.contraB;
        const pass = await helpers.encrypt(passA);
        const funcion = "aspirante";
        var numeroLenght = numero.length;
        const codigo = await newCode();
        var verE = await verEmail(email);
        if (passA != passB || verE === false) {
          console.log("Contraseña erronea, correo repetido o usuario invalido");
        } else {
          if (numeroLenght == 10) {
            const yy = [
              nombre,
              apPat,
              apMat,
              nacimiento,
              numero,
              email,
              codigo,
            ];
            const qq =
              "INSERT INTO aspirante(nombre,appat,apmat,birthday,numero,correo, codigo) values ($1, $2, $3, $4, $5, $6, $7)";
            const efeA = await pool.query(qq, yy);
            const id = await lastID();
            let login = [email, pass, id, funcion];
            const pp =
              "INSERT INTO login (usser, pass, id_aspirante, funcion) VALUES ($1, $2, $3, $4)";
            const aa = await pool.query(pp, login);
            const id_login = await getId_login(id);
            return done(null, id_login);
          } else {
            console.log("Error tamaño e.e", e);
          }
        }
      } catch (e) {
        console.log("catch:", e);
      }
    }
  )
);

passport.serializeUser((id_aspirante, done) => {
  try {
    return done(null, id_aspirante);
  } catch (e) {
    console.log("Error serial ", e);
  }
});

passport.deserializeUser((id_aspirante, done) => {
  try {
    const rea = aspirante(id_aspirante);
    return done(null, rea);
  } catch (e) {
    console.log("Error en Desereialize", e);
  }
});

const aspirante = async (id) => {
  try {
    console.log("HOLA");
    const query = "SELECT * FROM aspirante WHERE id_aspirante = $1";
    const data = [id];
    const res = await pool.query(query, data);
    console.log("RES", res.rows[0]);
    return res.rows[0];
  } catch (e) {
    console.log("Error aspirante", e);
  }
};
const lastID = async (req, res) => {
  try {
    const queryGet = await pool.query(
      "SELECT id_aspirante from aspirante ORDER BY id_aspirante DESC LIMIT 1;"
    );
    const id = queryGet.rows[0].id_aspirante;
    return id;
  } catch (e) {
    console.log("error lastId", e);
  }
};

const newCode = async (req, res) => {
  try {
    const getCode = await pool.query(
      "SELECT codigo from aspirante ORDER BY id_aspirante DESC LIMIT 1"
    );
    var count = getCode.rows[0].codigo;
    var sum = parseInt(count);
    var code = sum + 1;
    return code;
  } catch (e) {
    console.log("error newCode", e);
  }
};

var verEmail = async (email) => {
  try {
    const query = "SELECT count(*) from aspirante where correo = $1;";
    const correo = [email];
    const qq = await pool.query(query, correo);
    var count = qq.rows[0].count;
    var res = parseInt(count);
    if (res != 0) {
      //console.log("Mas de uno" , res);
      return false;
    } else {
      //console.log("Resultado:" , res);
      return true;
    }
  } catch (e) {
    console.log("error en el verEmail", e);
  }
};

const getId_login = async (ida) => {
  try {
    const getCode = "SELECT id_login FROM login where id_aspirante = $1";
    const id = [ida];
    const qq = await pool.query(getCode, id);
    var gg = qq.rows[0].id_login;
    var res = parseInt(gg);
    //console.log("ressss" , res)
    return res;
  } catch (e) {
    console.log("error newCode", e);
  }
};
