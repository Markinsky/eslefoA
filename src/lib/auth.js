module.exports = {
  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect("/signin");
  },
  adminLoggedIn(req, res, next) {
    const funcion = req.user.funcion;
    console.log("Func", funcion);
    if (funcion === "admin") {
      if (req.isAuthenticated()) {
        return next();
      }
      return res.redirect("/profile");
    }
    return res.redirect("/profile");
  },
  maestroLoggedIn(req, res, next) {
    const funcion = req.user.funcion;
    if (funcion === "maestro") {
      if (req.isAuthenticated()) {
        return next();
      }
      return res.redirect("/profile");
    }
    return res.redirect("/profile");
  },
  aspiranteLoggedIn(req, res, next) {
    const funcion = req.user.funcion;
    if (funcion === "aspirante") {
      if (req.isAuthenticated()) {
        return next();
      }
      return res.redirect("/profile");
    }
    return res.redirect("/profile");
  },
};
