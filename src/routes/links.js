const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/add", (req, res) => {
  res.render("links/add");
});

router.post("/add", async (req, res) => {});

router.get("/register", (req, res) => {
  res.render("links/register");
});

router.post("/register", async (req, res) => {});

router.get("/faq", (req, res) => {
  res.render("links/faq");
});
router.get("/login", (req, res) => {
  res.render("links/login");
});

router.get("/aboutus", (req, res) => {
  res.render("links/aboutus");
});

router.get("/rules", (req, res) => {
  res.render("links/rules");
});

router.get("/encuesta", (req, res) => {
  res.render("links/encuesta");
});

router.post("/encuesta", async (req, res) => {
  try {
    const calificacion = req.body.calificacion || "nulo";
    const respuesta = req.body.respuesta || "nulo";
    const check = req.body.check || "nulo";
    console.log("Cal", calificacion);
    if (calificacion === "nulo") {
      req.flash("error", "Error!");
      res.redirect("/links/encuesta");
    } else {
      const data = [calificacion, respuesta, check];
      const query =
        "INSERT INTO encuestainbox (calificacion, respuesta, checkbox) VALUES ($1, $2, $3)";
      const rest = await pool.query(query, data);
      req.flash("success", "Encuesta enviada con exito");
      res.redirect("/links/encuesta");
    }
  } catch (e) {
    console.log("Error post encuesta", e);
  }
});

router.get("/askus", (req, res) => {
  res.render("links/askus");
});

router.post("/askus", async (req, res) => {
  try {
    const nombre = req.body.nombre;
    const pregunta = req.body.pregunta;
    const email = req.body.email;
    const data = [pregunta, email, nombre];
    const query =
      "INSERT INTO preguntasinbox (pregunta, correo,estado,nombre) VALUES ($1, $2,'pendiente',$3)";
    const rest = await pool.query(query, data);
    req.flash("success", "La pregunta ha sido enviada con exito!");
    res.redirect("/links/askus");
  } catch (e) {
    console.log("Error askus ", e);
  }
});

//cursos

router.get("/watchcursos", async (req, res) => {
  //A
  const countCursosA = await pool.query(
    "SELECT COUNT(*) FROM detalles_curso WHERE id_nivel = 1"
  );
  const getCursosA = await pool.query(
    "SELECT *,(SELECT COUNT(*) FROM lista_curso WHERE estado = 'Aceptado' AND id_curso = es.id_curso) AS resultado FROM vercurso_espe as es WHERE id_nivel = 1"
  );
  var countA = countCursosA.rows[0].count;
  var cursosA = parseInt(countA);
  const resCursoA = getCursosA.rows;
  //B
  const countCursosB = await pool.query(
    "SELECT COUNT(*) FROM detalles_curso WHERE id_nivel = 2"
  );
  const getCursosB = await pool.query(
    "SELECT *,(SELECT COUNT(*) FROM lista_curso WHERE estado = 'Aceptado' AND id_curso = es.id_curso) AS resultado FROM vercurso_espe as es WHERE id_nivel = 2"
  );
  var countB = countCursosB.rows[0].count;
  var cursosB = parseInt(countB);
  const resCursoB = getCursosB.rows;
  //C
  const countCursosC = await pool.query(
    "SELECT COUNT(*) FROM detalles_curso WHERE id_nivel = 3"
  );
  const getCursosC = await pool.query(
    "SELECT *,(SELECT COUNT(*) FROM lista_curso WHERE estado = 'Aceptado' AND id_curso = es.id_curso) AS resultado FROM vercurso_espe as es WHERE id_nivel = 3"
  );
  var countC = countCursosC.rows[0].count;
  var cursosC = parseInt(countC);
  const resCursoC = getCursosC.rows;
  //D
  const countCursosD = await pool.query(
    "SELECT COUNT(*) FROM detalles_curso WHERE id_nivel = 4"
  );
  const getCursosD = await pool.query(
    "SELECT *,(SELECT COUNT(*) FROM lista_curso WHERE estado = 'Aceptado' AND id_curso = es.id_curso) AS resultado FROM vercurso_espe as es WHERE id_nivel = 4"
  );
  var countD = countCursosD.rows[0].count;
  var cursosD = parseInt(countD);
  const resCursoD = getCursosD.rows;
  //E
  const countCursosE = await pool.query(
    "SELECT COUNT(*) FROM detalles_curso WHERE id_nivel = 5"
  );
  const getCursosE = await pool.query(
    "SELECT *,(SELECT COUNT(*) FROM lista_curso WHERE estado = 'Aceptado' AND id_curso = es.id_curso) AS resultado FROM vercurso_espe as es WHERE id_nivel = 5"
  );
  var countE = countCursosE.rows[0].count;
  var cursosE = parseInt(countE);
  const resCursoE = getCursosE.rows;
  //F
  const countCursosF = await pool.query(
    "SELECT COUNT(*) FROM detalles_curso WHERE id_nivel = 6"
  );
  const getCursosF = await pool.query(
    "SELECT *,(SELECT COUNT(*) FROM lista_curso WHERE estado = 'Aceptado' AND id_curso = es.id_curso) AS resultado FROM vercurso_espe as es WHERE id_nivel = 6"
  );
  var countF = countCursosF.rows[0].count;
  var cursosF = parseInt(countF);
  const resCursoF = getCursosF.rows;
  res.render("links/cursos", {
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

//ubicacion
router.get("/ubication", async (req, res) => {
  res.render("links/ubication");
});

//calif
router.get("/calif", async (req, res) => {
  try {
    res.render("links/searchcalif");
  } catch (e) {
    console.log("Error calif", e);
  }
});

router.post("/calif", async (req, res) => {
  try {
    const { code } = req.body;
    const aa = await pool.query(
      "SELECT * FROM lista_aceptados WHERE codigo =$1 AND estado ='Aceptado'",
      [code]
    );
    const sears = aa.rows;
    res.render("links/searchcalif", { sears });
  } catch (e) {
    console.log("Error calif", e);
  }
});

//videos
router.get("/videos", (req, res) => {
  res.render("links/videos");
});
module.exports = router;
