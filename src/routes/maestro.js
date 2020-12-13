const express = require("express");
const router = express.Router();
const pool = require("../db");

//Ver cursos
router.get("/cursosmaestro", async (req, res) => {
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

router.get("/cursomaestro/verlista/:id_curso", async (req, res) => {
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
});

router.get("/cursomaestro/cali/:id_curso", async (req, res) => {
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
});

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
module.exports = router;
