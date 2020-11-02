const express = require("express");
const router = express.Router();
const passport = require('passport');


router.get ("/sign" , (req, res) =>{
    res.render("auth/register");
});

router.post("/sign", passport.authenticate("local.signup",{
    succesRedirect: "/profile",
    failureRedirect: "/sign",
    failureFlash: true 
}));


router.get ("/profile", (req, res) =>{
    res.send("Perfil uwu");
});


module.exports = router;