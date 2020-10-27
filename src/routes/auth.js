const express = require("express");
const router = express.Router();
const pool = require("../db");
const passport = require("passport");


router.get ("/sign" , (req, res) =>{
    res.render("auth/register");
});

router.post("/sign", passport.authenticate("local.sign",{
    succesRedirect: "/profile",
    failureRedirect: "/sign",
    failureFlash: true 
}));


router.get ("/profile", (req, res) =>{
    res.send("Perfil uwu");
});


module.exports = router;