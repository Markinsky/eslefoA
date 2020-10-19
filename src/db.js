const {Pool} = require("pg");
const {promisify} = require("util");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "7734",
    database: "eslefodb"

});

pool.query = promisify(pool.query);
module.exports=pool;