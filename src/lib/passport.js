const { Strategy } = require("passport");
const passport = require("passport");
const LocalStrategy = require ("passport-local").Strategy;

passport.use("local.sign", new LocalStrategy({
    usernameField: "usuario",
    passwordField: "contraA",
    passReqToCallback: true
}, async (req, username, password, done) =>{
    console.log(req.body);
}));

//passport.serializeUser((usr, done) =>{
//
//});