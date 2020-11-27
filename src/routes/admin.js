const express = require("express");
const router = express.Router();
const pool = require("../db");
const helpers = require("../lib/helpers");

//Cursos
router.get("/newcurso", async (req, res) => {
  const master = await pool.query(
    "SELECT nombre, appat from aspirante WHERE funcion = 'maestro';"
  );
  const maestro = master.rows[0].nombre;
  var out = [];
  for (var i = 0; i < master.rowCount; i++) {
    var nombre = master.rows[i].nombre;
    var apellido = master.rows[i].appat;
    out[i] = nombre + " " + apellido;
  }
  var jsonArray = JSON.parse(JSON.stringify(out));
  res.render("admin/cursos", { maestros: jsonArray });
});

router.post("/newcurso", async (req, res) => {
  try {
  } catch (e) {
    console.log("ERROR NEW CURSO", e);
  }
});

//Aspirante
router.get("/verasp", async (req, res) => {
  const ver = await pool.query(
    "SELECT * FROM login as l INNER JOIN aspirante as x ON l.id_aspirante = x.id_aspirante AND x.id_aspirante = l.id_aspirante AND funcion = 'aspirante'"
  );
  const hola = ver.rows;
  res.render("admin/verp", { hola });
});

router.get("/verasp/edit/:id_aspirante", async (req, res) => {
  const { id_aspirante } = req.params;
  const search = await pool.query(
    "SELECT l.usser,l.id_aspirante,x.nombre, x.appat, x.apmat, x.numero  FROM login as l INNER JOIN aspirante as x ON l.id_aspirante = $1 AND x.id_aspirante = $1 AND funcion = 'aspirante'",
    [id_aspirante]
  );
  const returnasp = search.rows[0];
  res.render("admin/editasp", { returnasp });
});

router.post("/verasp/edit/:id_aspirante", async (req, res) => {
  const { id_aspirante } = req.params;
  const { nombre, apPat, apMat, numero, email, nacimiento } = req.body;
  const editquery = await pool.query(
    "UPDATE aspirante SET nombre = $1, appat=$2, apmat=$3, birthday=$4,numero=$5 WHERE id_aspirante = $6",
    [nombre, apPat, apMat, nacimiento, numero, id_aspirante]
  );
  const editlogin = await pool.query(
    "UPDATE login SET usser = $1 WHERE id_aspirante = $2",
    [email, id_aspirante]
  );
  res.redirect("/verasp");
});

router.get("/verasp/drop/:id_aspirante", async (req, res) => {
  try {
    const { id_aspirante } = req.params;
    const dropy = await pool.query(
      "DELETE FROM aspirante WHERE id_aspirante = $1",
      [id_aspirante]
    );
    req.flash("success", "Borrado con exito");
    res.redirect("/verasp");
  } catch (e) {
    console.log("Error drop", e);
  }
});

router.get("/verasp/pass/:id_aspirante", async (req, res) => {
  const { id_aspirante } = req.params;
  res.render("admin/editpassap", { id_aspirante });
});

router.post("/verasp/editpass/:id_aspirante", async (req, res) => {
  const { id_aspirante } = req.params;
  const contra = req.body.pass;
  const pass = await helpers.encrypt(contra);
  const hul = await pool.query(
    "UPDATE login SET pass = $1  WHERE id_aspirante = $2",
    [pass, id_aspirante]
  );
  req.flash("success", "Contraseña cambiada correctamente");
  res.redirect("/verasp");
});

//Preguntas
router.get("/adminpreg", async (req, res) => {
  const pregjson = await pool.query(
    "SELECT * FROM preguntasinbox WHERE estado = 'pendiente';"
  );
  const preg = pregjson.rows;
  res.render("admin/preg", { preg });
});

//Maestros
router.get("/verm", async (req, res) => {
  const ver = await pool.query(
    "SELECT * FROM login as l INNER JOIN aspirante as x ON l.id_aspirante = x.id_aspirante AND x.id_aspirante = l.id_aspirante AND funcion = 'maestro'"
  );
  const hola = ver.rows;
  res.render("admin/verm", { hola });
});

router.get("/verm/add", (req, res) => {
  res.render("admin/vermad");
});

router.post("/vermad", async (req, res) => {
  try {
    const {
      nombre,
      apPat,
      apMat,
      nacimiento,
      numero,
      email,
      contra,
    } = req.body;
    var verE = await verEmail(email);
    if (verE === true) {
      const codigo = await newCode();
      const pass = await helpers.encrypt(contra);
      const qAspira = await pool.query(
        "INSERT INTO aspirante(nombre,appat,apmat,birthday,numero,codigo, funcion) values ($1, $2, $3, $4, $5, $6, 'maestro')",
        [nombre, apPat, apMat, nacimiento, numero, codigo]
      );
      if (qAspira.rowCount > 0) {
        const id = await lastID();
        const qLogin = await pool.query(
          "INSERT INTO login (usser, pass, id_aspirante) VALUES ($1, $2, $3)",
          [email, pass, id]
        );
        if (qLogin.rowCount > 0) {
          req.flash("success", "Nuevo maestro agregado correctamente");
          res.redirect("/verm");
        } else {
          req.flash("error", "Error login");
          res.redirect("/verm");
        }
      } else {
        req.flash("error", "Error aspirante");
        res.redirect("/verm");
      }
    } else {
      req.flash("error", "Correo existente");
      res.redirect("/verm");
    }
  } catch (e) {
    console.log("ERRRO vermad", e);
  }
});

router.get("/verm/edit/:id_aspirante", async (req, res) => {
  const { id_aspirante } = req.params;
  const search = await pool.query(
    "SELECT l.usser,l.id_aspirante,x.nombre, x.appat, x.apmat, x.numero  FROM login as l INNER JOIN aspirante as x ON l.id_aspirante = $1 AND x.id_aspirante = $1 AND funcion = 'maestro'",
    [id_aspirante]
  );
  const returnasp = search.rows[0];
  res.render("admin/editmae", { returnasp });
});

router.post("/vermaes/edit/:id_aspirante", async (req, res) => {
  const { id_aspirante } = req.params;
  const { nombre, apPat, apMat, numero, email, nacimiento } = req.body;
  const editquery = await pool.query(
    "UPDATE aspirante SET nombre = $1, appat=$2, apmat=$3, birthday=$4,numero=$5 WHERE id_aspirante = $6",
    [nombre, apPat, apMat, nacimiento, numero, id_aspirante]
  );
  const editlogin = await pool.query(
    "UPDATE login SET usser = $1 WHERE id_aspirante = $2",
    [email, id_aspirante]
  );
  res.redirect("/verm");
});

router.get("/verm/editpass/:id_aspirante", async (req, res) => {
  const { id_aspirante } = req.params;
  res.render("admin/editmaepass", { id_aspirante });
});

router.post("/verm/editpass/:id_aspirante", async (req, res) => {
  const { id_aspirante } = req.params;
  const contra = req.body.pass;
  const pass = await helpers.encrypt(contra);
  const hul = await pool.query(
    "UPDATE login SET pass = $1  WHERE id_aspirante = $2",
    [pass, id_aspirante]
  );
  req.flash("success", "Contraseña cambiada correctamentee");
  res.redirect("/verm");
});

//Extras
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

var verEmail = async (email) => {
  try {
    const query = "SELECT count(*) from login where usser = $1;";
    const correo = [email];
    const qq = await pool.query(query, correo);
    var count = qq.rows[0].count;
    var res = parseInt(count);
    console.log(res);
    if (res != 0) {
      //console.log("No es igual" , res);
      return false;
    } else {
      //console.log("Si es igual:" , res);
      return true;
    }
  } catch (e) {
    console.log("error en el verEmail", e);
  }
};
module.exports = router;
