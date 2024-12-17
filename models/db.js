const { Client } = require('pg');

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "123456",
    database: "users",
})

client.connect()
    .then(() => console.log("Conectado com sucesso ao banco de dados"))
    .catch((err) => console.log("Ocorreu um erro ao conectar com o banco de dados: " + err))

client.query(`SELECT * FROM accounts`, (err, res)=>{
    if(!err){
        console.log(res.rows);
    } else{
        console.log(err.message);
    }

})

module.exports = client;