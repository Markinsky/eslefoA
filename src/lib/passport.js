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
            done(null, {
              id_aspirante: user.id_aspirante,
              nombre: user.nombre,
            });
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
    async (req, email, contraA, done) => {}
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id_aspirante);
});

passport.deserializeUser(async (user, done) => {
  console.log("TRUNK");
  const sel = await pool.query(
    "SELECT * FROM aspirante WHERE id_aspirante = $1",
    [user.id_aspirante]
  );
  console.log("row", sel.rows[0]);
  done(null, sel.rows[0]);
});
