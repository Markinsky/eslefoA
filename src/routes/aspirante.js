const express = require("express");
const router = express.Router();
const pool = require("../db");

//calificaciones
router.get("/calif", (req, res) => {
  res.render("asp/calif");
});

//preguntas
router.get("/ask", (req, res) => {
  res.render("asp/ask");
});

router.post("/ask", async (req, res) => {
  try {
    const nombre = req.body.nombre;
    const pregunta = req.body.pregunta;
    const email = req.body.email;
    const data = [pregunta, email, nombre];
    const query =
      "INSERT INTO preguntasinbox (pregunta,correo,estado,nombre) VALUES ($1, $2,'pendiente',$3)";
    const rest = await pool.query(query, data);
    req.flash("success", "La pregunta ha sido enviada con exito!");
    res.redirect("/ask");
  } catch (e) {
    console.log("Error ask ", e);
  }
});

//Cursos
router.get("/registercurso", async (req, res) => {
  //A
  const countCursosA = await pool.query(
    "SELECT COUNT(*) FROM detalles_curso WHERE id_nivel = 1"
  );
  const getCursosA = await pool.query(
    "SELECT * FROM vercurso_espe WHERE id_nivel = 1"
  );
  var countA = countCursosA.rows[0].count;
  var cursosA = parseInt(countA);
  const resCursoA = getCursosA.rows;
  //B
  const countCursosB = await pool.query(
    "SELECT COUNT(*) FROM detalles_curso WHERE id_nivel = 2"
  );
  const getCursosB = await pool.query(
    "SELECT * FROM vercurso_espe WHERE id_nivel = 2"
  );
  var countB = countCursosB.rows[0].count;
  var cursosB = parseInt(countB);
  const resCursoB = getCursosB.rows;
  //C
  const countCursosC = await pool.query(
    "SELECT COUNT(*) FROM detalles_curso WHERE id_nivel = 3"
  );
  const getCursosC = await pool.query(
    "SELECT * FROM vercurso_espe WHERE id_nivel = 3"
  );
  var countC = countCursosC.rows[0].count;
  var cursosC = parseInt(countC);
  const resCursoC = getCursosC.rows;
  //D
  const countCursosD = await pool.query(
    "SELECT COUNT(*) FROM detalles_curso WHERE id_nivel = 4"
  );
  const getCursosD = await pool.query(
    "SELECT * FROM vercurso_espe WHERE id_nivel = 4"
  );
  var countD = countCursosD.rows[0].count;
  var cursosD = parseInt(countD);
  const resCursoD = getCursosD.rows;
  //E
  const countCursosE = await pool.query(
    "SELECT COUNT(*) FROM detalles_curso WHERE id_nivel = 5"
  );
  const getCursosE = await pool.query(
    "SELECT * FROM vercurso_espe WHERE id_nivel = 5"
  );
  var countE = countCursosE.rows[0].count;
  var cursosE = parseInt(countE);
  const resCursoE = getCursosE.rows;
  //F
  const countCursosF = await pool.query(
    "SELECT COUNT(*) FROM detalles_curso WHERE id_nivel = 6"
  );
  const getCursosF = await pool.query(
    "SELECT * FROM vercurso_espe WHERE id_nivel = 6"
  );
  var countF = countCursosF.rows[0].count;
  var cursosF = parseInt(countF);
  const resCursoF = getCursosF.rows;
  res.render("asp/registercurso", {
    cursosA,
    resCursoA,
    cursosB,
    resCursoB,
    cursosC,
    resCursoC,
    cursosD,
    resCursoD,
    cursosE,
    resCursoE,
    cursosF,
    resCursoF,
  });
});

router.get("/registercurso/edit/:id_curso", async (req, res) => {
  try {
    const { id_curso } = req.params;
    const id_aspirante = req.user.id_aspirante;
    const qA = await pool.query(
      "SELECT * FROM vercurso_espe WHERE id_curso = $1",
      [id_curso]
    );
    const cursBack = qA.rows[0];
    console.log("cursBack", cursBack);
    res.render("asp/showcurso", { id_aspirante, id_curso, cursBack });
  } catch (e) {
    console.log("ERROR REGISTER CURSO SOLICITAR", e);
  }
});

router.post("/registercurso", async (req, res) => {
  try {
    //const { nombre_curso, nivel_curso, vacantes, ID, id_curso } = req.body;
    const nivel_curso = req.body.nivel_curso;
    const ID = req.body.ID;
    const email = req.user.usser;
    var id_usuario = parseInt(ID);
    var id_nivel = parseInt(nivel_curso);
    console.log("POST", nivel_curso, ID);
    console.log("PRE", id_nivel, id_usuario);
    //const qq = await pool.query(
    //  "INSERT INTO pago (fecha, correo, id_nivel, estado, id_aspirante) VALUES (CURRENT_DATE, $1, $2,'Pendiente',$3)",
    //  [email, id_nivel, id_usuario]
    //);
    res.redirect("asp/showcurso");
  } catch (e) {
    console.log("Error solicitud grupo", e);
  }
});
module.exports = router;
