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
module.exports = router;
