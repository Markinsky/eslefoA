const {Pool} = require("pg");
const {promisify} = require("util");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "7734",
    database: "eslefodb"

});

const prueba = () =>{
    console.log("funcioa");
};

pool.query = promisify(pool.query);
module.exports=pool;