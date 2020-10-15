const pg = require("mysql");
const {promisify} = require("util");
const {database}=require("./keys");
const pool = pg.createPool(database);

pool.getConnection((err, connection) =>{
    if(err){
        console.log(err);
        if(err.code === "PROTOCOL_CONNECTION_LOST"){
            console.error("Cerradoa");
        }if(err.code === "ER_CON_COUNT_ERROR"){
            console.error("Mucha conexion");
        }if(err.code === "ECONNREFUSED"){
            console.error("Rechazado");
        }
    }
    if(connection){
        connection.release();
        console.log("Conectado correctamente");
        return;    
    }
});
pool.query = promisify(pool.query);
module.exports=pool;