const express = require("express");
const router = express.Router();
const pool = require("../db");
const { maestroLoggedIn } = require("../lib/auth");
//Ver cursos
router.get("/cursosmaestro", maestroLoggedIn, async (req, res) => {
  try {
    const id_aspirante = req.user.id_aspirante;
    const a = await pool.query(
      "SELECT *, (SELECT COUNT(*) FROM lista_curso WHERE estado = 'Aceptado' AND id_curso = vp.id_curso) AS resultado FROM vercurso_espe AS vp WHERE id_maestro = $1",
      [id_aspirante]
    );
    const arr = a.rows;
    res.render("maes/vercursos", { arr });
  } catch (e) {
    console.log("Error ver cursos maestro", e);
  }
});

router.get(
  "/cursomaestro/verlista/:id_curso",
  maestroLoggedIn,
  async (req, res) => {
    try {
      const { id_curso } = req.params;
      const queru = await pool.query(
        "SELECT * FROM lista_aceptados WHERE estado = 'Aceptado' AND id_curso = $1",
        [id_curso]
      );
      const a = queru.rows;
      res.render("maes/lista", { a });
    } catch (e) {
      console.log("Error ver lista ", e);
    }
  }
);

router.get(
  "/cursomaestro/cali/:id_curso",
  maestroLoggedIn,
  async (req, res) => {
    try {
      const { id_curso } = req.params;
      const queru = await pool.query(
        "SELECT * FROM lista_aceptados WHERE estado = 'Aceptado' AND id_curso = $1",
        [id_curso]
      );
      const a = queru.rows;
      res.render("maes/listacalif", { a });
    } catch (e) {
      console.log("Error ver lista ", e);
    }
  }
);

router.post("/actcalif", async (req, res) => {
  try {
    const { calif, id, id_curso } = req.body;
    var len = id.length;
    for (var i = 0; i <= len; i++) {
      var a = await pool.query(
        "UPDATE lista_curso SET calificacion = $1 WHERE id_aspirante= $2 AND id_curso = $3",
        [calif[i], id[i], id_curso[0]]
      );
    }
    req.flash("success", "Calificaciones subidas");
    res.redirect("/cursosmaestro");
  } catch (e) {
    console.log("Error post nana", e);
  }
});

router.get(
  "/cursomaestro/bitacora/:id_curso",
  maestroLoggedIn,
  async (req, res) => {
    try {
      const { id_curso } = req.params;
      const s = await pool.query("SELECT * FROM bitacora WHERE id_curso = $1", [
        id_curso,
      ]);
      const sa = s.rows;
      res.render("maes/bitacoramaes", { sa, id_curso });
    } catch (e) {
      console.log("Error bitcaora qwq", e);
    }
  }
);

router.get("/bita/add/:id_curso", maestroLoggedIn, async (req, res) => {
  try {
    const { id_curso } = req.params;
    res.render("maes/bitaadd", { id_curso });
  } catch (e) {
    console.log("Error bitadd", e);
  }
});

router.post("/bita/add/:id_curso", async (req, res) => {
  try {
    const { id_curso } = req.params;
    const { titulo, contenido } = req.body;
    const sd = await pool.query(
      "INSERT INTO bitacora (titulo, contenido, fecha, id_curso) VALUES ($1,$2, CURRENT_DATE, $3)",
      [titulo, contenido, id_curso]
    );
    req.flash("success", "Entrada de la bitacora agregada con exito");
    res.redirect("/cursosmaestro");
  } catch (e) {
    console.log("Error bitadd", e);
  }
});

router.get("/bita/edit/:id_bitacora", maestroLoggedIn, async (req, res) => {
  try {
    const { id_bitacora } = req.params;
    const a = await pool.query(
      "SELECT * FROM bitacora WHERE id_bitacora = $1",
      [id_bitacora]
    );
    const megumin = a.rows[0];
    console.log("id", megumin);
    res.render("maes/bitaedit", { megumin });
  } catch (e) {
    console.log("Error edit", e);
  }
});

router.post("/bita/edit/:id_bitacora", async (req, res) => {
  try {
    const { id_bitacora } = req.params;
    const { titulo, contenido } = req.body;
    const upd = await pool.query(
      "UPDATE bitacora SET titulo= $1, contenido=$2 WHERE id_bitacora = $3",
      [titulo, contenido, id_bitacora]
    );
    req.flash("success", "Entrada de la bitacora editada con exito");
    res.redirect("/cursosmaestro");
  } catch (e) {
    console.log("Error post edit bita", e);
  }
});

module.exports = router;
