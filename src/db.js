const mysql = require("mysql");
const {database}=require("./keys");
const {promisify} = require("util");
const pool = mysql.createPool(database);

pool.getConnection((err, connection) =>{
    if(err){
        if(err.code === "PROTOCOL_CONNECTION_LOST"){
            console.error("Cerradoa");
        }if(err.code === "ER_CON_COUNT_ERROR"){
            console.error("Mucha conexion");
        }if(err.code === "ECONNREFUSED"){
            console.error("Rechazado");
        }
    }
    if(connection)connection.release();
        console.log("Conectado correctamente");
        return;    
});
pool.query = promisify(pool.query);
module.exports=pool;