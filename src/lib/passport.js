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
        const rows = await pool.query("SELECT * FROM login WHERE usser = $1", [
          email,
        ]);
        if (rows.rowCount > 0) {
          const user = rows.rows[0];
          const validPass = await helpers.matchPass(pass, user.pass);
          if (validPass) {
            done(null, user);
          } else {
            done(null, false, req.flash("error", "Contraseña invalida"));
          }
        } else {
          done(null, false, req.flash("error", "Usuario no existe"));
        }
      } catch (e) {
        console.log("Error login:", e);
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
        const passA = req.body.contraA;
        const passB = req.body.contraB;
        if (passA === passB) {
          const email = req.body.email;
          var verE = await verEmail(email);
          if (verE === true) {
            const numero = req.body.numero;
            var numeroLenght = numero.length;
            if (numeroLenght == 10) {
              const nombre = req.body.nombre;
              const apPat = req.body.apPat;
              const apMat = req.body.apMat;
              const nacimiento = req.body.nacimiento;
              const pass = await helpers.encrypt(passA);
              const funcion = "aspirante";
              const codigo = await newCode();
              const insertAspirante = await pool.query(
                "INSERT INTO aspirante(nombre,appat,apmat,birthday,numero,correo, codigo) values ($1, $2, $3, $4, $5, $6, $7)",
                [nombre, apPat, apMat, nacimiento, numero, email, codigo]
              );
              if (insertAspirante.rowCount > 0) {
                const id = await lastID();
                const insertLogin = await pool.query(
                  "INSERT INTO login (usser, pass, id_aspirante, funcion) VALUES ($1, $2, $3, $4)",
                  [email, pass, id, funcion]
                );
                if (insertLogin.rowCount > 0) {
                  const last = await lastID();
                  const selectLogin = await pool.query(
                    "SELECT * FROM login WHERE id_aspirante = $1",
                    [last]
                  );
                  const user = selectLogin.rows[0];
                  console.log("USER", user);
                  done(null, user);
                } else {
                  console.log("HOLA SOY UN ERROR");
                  done(null, false, req.flash("error", "ERROR login"));
                }
              } else {
                done(null, false, req.flash("error", "ERROR aspirante"));
              }
            } else {
              done(
                null,
                false,
                req.flash("error", "Numero telefonico invalido")
              );
            }
          } else {
            done(null, false, req.flash("error", "Correo ya existente"));
          }
        } else {
          done(null, false, req.flash("error", "Contraseñas no coinciden"));
        }
      } catch (e) {
        console.log("Errro register", e);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id_aspirante);
});

passport.deserializeUser(async (id, done) => {
  console.log("TRUNK", id);
  const sel = await pool.query(
    "SELECT * FROM login as l INNER JOIN aspirante as x ON l.id_aspirante = $1 AND x.id_aspirante = $1",
    [id]
  );
  console.log("row", sel.rows[0]);
  done(null, sel.rows[0]);
});

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
