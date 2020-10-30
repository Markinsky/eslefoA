const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/add", (req, res) =>{
    res.render("links/add");
});

router.post("/add", async (req, res) =>{
  
});

router.get("/register", (req, res) =>{
    res.render("links/register");
});

router.post("/register", async(req, res)=>{
  
});
router.get("/faq", (req, res) =>{
    res.render("links/faq");
});
router.get("/login", (req, res) =>{
    res.render("links/login");
});

router.get("/aboutus", (req, res) =>{
    res.render("links/aboutus");
});
module.exports = router;