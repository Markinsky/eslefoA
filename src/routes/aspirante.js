const express = require("express");
const router = express.Router();

router.get("/calif", (req, res) => {
  res.render("asp/calif");
});

module.exports = router;
