const express = require("express");
const router = express.Router();
const pool = require("../db");
const { aspiranteLoggedIn } = require("../lib/auth");

//calificaciones
router.get("/aspcalif", aspiranteLoggedIn, async (req, res) => {
  const code = req.user.codigo;
  const aa = await pool.query(
    "SELECT * FROM lista_aceptados WHERE codigo =$1 AND estado ='Aceptado'",
    [code]
  );
  console.log("Codigo", code);
  const sears = aa.rows;
  res.render("asp/calif", { sears });
});

router.post("/aspcalif", aspiranteLoggedIn, async (req, res) => {
  try {
    const { code } = req.body;
    const aa = await pool.query(
      "SELECT * FROM lista_aceptados WHERE codigo =$1 AND estado ='Aceptado'",
      [code]
    );
    const sears = aa.rows;
    res.render("asp/calif", { sears });
  } catch (e) {
    console.log("Error calif", e);
  }
});

//preguntas
router.get("/ask", aspiranteLoggedIn, (req, res) => {
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
router.get("/registercurso", aspiranteLoggedIn, async (req, res) => {
  //A
  const countCursosA = await pool.query(
    "SELECT COUNT(*) FROM detalles_curso WHERE id_nivel = 1"
  );
  const getCursosA = await pool.query(
    "SELECT *, (SELECT COUNT(*) FROM lista_curso WHERE estado = 'Aceptado' AND id_curso = vp.id_curso) AS resultado FROM vercurso_espe as vp WHERE id_nivel = 1"
  );
  var countA = countCursosA.rows[0].count;
  var cursosA = parseInt(countA);
  const resCursoA = getCursosA.rows;
  //B
  const countCursosB = await pool.query(
    "SELECT COUNT(*) FROM detalles_curso WHERE id_nivel = 2"
  );
  const getCursosB = await pool.query(
    "SELECT *, (SELECT COUNT(*) FROM lista_curso WHERE estado = 'Aceptado' AND id_curso = vp.id_curso) AS resultado FROM vercurso_espe as vp WHERE id_nivel = 2"
  );
  var countB = countCursosB.rows[0].count;
  var cursosB = parseInt(countB);
  const resCursoB = getCursosB.rows;
  //C
  const countCursosC = await pool.query(
    "SELECT COUNT(*) FROM detalles_curso WHERE id_nivel = 3"
  );
  const getCursosC = await pool.query(
    "SELECT *, (SELECT COUNT(*) FROM lista_curso WHERE estado = 'Aceptado' AND id_curso = vp.id_curso) AS resultado FROM vercurso_espe as vp WHERE id_nivel = 3"
  );
  var countC = countCursosC.rows[0].count;
  var cursosC = parseInt(countC);
  const resCursoC = getCursosC.rows;
  //D
  const countCursosD = await pool.query(
    "SELECT COUNT(*) FROM detalles_curso WHERE id_nivel = 4"
  );
  const getCursosD = await pool.query(
    "SELECT *, (SELECT COUNT(*) FROM lista_curso WHERE estado = 'Aceptado' AND id_curso = vp.id_curso) AS resultado FROM vercurso_espe as vp WHERE id_nivel = 4"
  );
  var countD = countCursosD.rows[0].count;
  var cursosD = parseInt(countD);
  const resCursoD = getCursosD.rows;
  //E
  const countCursosE = await pool.query(
    "SELECT COUNT(*) FROM detalles_curso WHERE id_nivel = 5"
  );
  const getCursosE = await pool.query(
    "SELECT *, (SELECT COUNT(*) FROM lista_curso WHERE estado = 'Aceptado' AND id_curso = vp.id_curso) AS resultado FROM vercurso_espe as vp WHERE id_nivel = 5"
  );
  var countE = countCursosE.rows[0].count;
  var cursosE = parseInt(countE);
  const resCursoE = getCursosE.rows;
  //F
  const countCursosF = await pool.query(
    "SELECT COUNT(*) FROM detalles_curso WHERE id_nivel = 6"
  );
  const getCursosF = await pool.query(
    "SELECT *, (SELECT COUNT(*) FROM lista_curso WHERE estado = 'Aceptado' AND id_curso = vp.id_curso) AS resultado FROM vercurso_espe as vp WHERE id_nivel = 6"
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

router.get(
  "/registercurso/edit/:id_curso",
  aspiranteLoggedIn,
  async (req, res) => {
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
  }
);

//adeudo
router.post("/registercurso/debt", async (req, res) => {
  try {
    const {
      nombre_curso,
      id_nivel,
      nivel_curso,
      vacantes,
      ID,
      id_curso,
    } = req.body;
    var id_usuario = parseInt(ID);
    const email = req.user.usser;
    const setch = await pool.query(
      "SELECT COUNT(*) FROM lista_curso WHERE id_aspirante = $1 AND (estado = 'Pendiente' OR estado ='Aceptado')",
      [id_usuario]
    );
    const elpepe = setch.rows[0].count;
    console.log("pepe", elpepe);
    if (elpepe == 0) {
      const qqa = await pool.query(
        "INSERT INTO pago (fecha, correo, id_nivel, id_aspirante) VALUES (CURRENT_DATE, $1, $2,$3) RETURNING id_pago",
        [email, id_nivel, id_usuario]
      );
      const id_pago = qqa.rows[0].id_pago;
      const qq = await pool.query(
        "INSERT INTO lista_curso (id_curso, id_aspirante, estado, id_pago) VALUES ($1, $2,'Pendiente', $3)",
        [id_curso, id_usuario, id_pago]
      );
      res.redirect("/registercurso");
    } else {
      req.flash(
        "error",
        "Ya tienes una solicitud o ya pertences a un grupo existente"
      );
      res.redirect("/registercurso");
    }
  } catch (e) {
    console.log("Error solicitud grupo", e);
  }
});

//pagos
router.get("/pagosasp", aspiranteLoggedIn, async (req, res) => {
  const id = req.user.id_aspirante;
  const qDebt = await pool.query(
    "SELECT *, (SELECT COUNT(*) FROM lista_curso WHERE estado = 'Aceptado' AND id_curso = vp.id_curso) AS resultado FROM view_pago as vp WHERE id_aspirante = $1 AND estado = 'Pendiente'",
    [id]
  );
  const cDebt = await pool.query(
    "SELECT COUNT(*) FROM lista_curso WHERE id_aspirante = $1 AND estado = 'Pendiente';",
    [id]
  );
  const cResult = cDebt.rows[0].count;
  const arrayDebt = qDebt.rows;
  const otroDebt = await pool.query(
    "SELECT * FROM view_otro_pago WHERE id_aspirante = $1 AND estado = 'Pendiente'",
    [id]
  );
  const oDebt = await pool.query(
    "SELECT COUNT(*) FROM otros_pagos WHERE id_aspirante = $1 AND estado = 'Pendiente';",
    [id]
  );
  const oResult = oDebt.rows[0].count;
  const arrayoDebt = otroDebt.rows;
  res.render("asp/debts", { cResult, arrayDebt, oResult, arrayoDebt });
});

router.get("/debts/transfer/:id_pago", aspiranteLoggedIn, async (req, res) => {
  try {
    const { id_pago } = req.params;
    const sq = await pool.query(
      "SELECT * FROM view_pago WHERE  id_pago = $1 AND estado = 'Pendiente';",
      [id_pago]
    );
    const arr = sq.rows[0];
    res.render("asp/transfer", { arr });
  } catch (e) {
    console.log("ERROR DEBTSS", e);
  }
});

//mi curso
router.get("/miscursos", aspiranteLoggedIn, async (req, res) => {
  try {
    const id = req.user.id_aspirante;
    const insom = await pool.query(
      "SELECT * FROM lista_curso WHERE id_aspirante = $1 AND estado = 'Aceptado'",
      [id]
    );
    var choco = insom.rows[0].id_curso;
    const dara = insom.rowCount;
    if (dara > 0) {
      const etoit = await pool.query(
        "SELECT * FROM vercurso_espe WHERE id_curso = $1",
        [choco]
      );
      const et = etoit.rows[0];
      res.render("asp/micurso", { et });
    } else {
      req.flash("error", "No tienes ningun curso activo");
      res.redirect("/profile");
    }
  } catch (e) {
    console.log("Error mi curso", e);
  }
});

router.get(
  "/micurso/bitacora/:id_curso",
  aspiranteLoggedIn,
  async (req, res) => {
    try {
      const { id_curso } = req.params;
      const s = await pool.query("SELECT * FROM bitacora WHERE id_curso = $1", [
        id_curso,
      ]);
      const sa = s.rows;
      res.render("asp/bitacora", { sa, id_curso });
    } catch (e) {
      console.log("Error bitcaora qwq", e);
    }
  }
);
module.exports = router;
