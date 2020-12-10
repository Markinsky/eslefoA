const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLoggedIn } = require("../lib/auth");
const pool = require("../db");

router.get("/signup", (req, res) => {
  res.render("auth/register");
});

router.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/profile",
    failureRedirect: "/signup",
    failureFlash: true,
  })
);

router.get("/signin", (req, res) => {
  res.render("auth/login");
});

router.post("/signin", (req, res, next) => {
  passport.authenticate("local-signin", {
    successRedirect: "/profile",
    failureRedirect: "/signin",
    failureFlash: true,
  })(req, res, next);
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile");
});

router.get("/editdata/:id_aspirante", async (req, res) => {
  const { id_aspirante } = req.params;
  const qq = await pool.query(
    "SELECT * FROM aspirante WHERE id_aspirante = $1 AND funcion = 'aspirante'",
    [id_aspirante]
  );
  const arr = qq.rows[0];
  res.render("auth/edituser", { arr });
});

router.post("/editdata/:id_aspirante", async (req, res) => {
  try {
    const { id_aspirante } = req.params;
    const { nombre, apPat, apMat, date, numero } = req.body;
    const length = numero.length;
    if (length == 10) {
      const juju = await pool.query(
        "UPDATE aspirante SET nombre =$1, appat = $2, apmat = $3, numero =$4, birthday=$5 WHERE id_aspirante = $6",
        [nombre, apPat, apMat, numero, date, id_aspirante]
      );
      const back = juju.rowCount;
      if (back == 1) {
        req.logOut();
        req.flash("success", "Datos editados, favor de hacer login de nuevo");
        res.redirect("/signin");
      } else {
        req.flash("error", "Ha ocurrido un error");
        res.redirect("/profile");
      }
    } else {
      req.flash("error", "Datos invalidos");
      res.redirect("/profile");
    }
  } catch (e) {
    console.log("Error edit jaja", e);
  }
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/signin");
});

module.exports = router;
