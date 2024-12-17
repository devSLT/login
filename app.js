const express = require('express');
const app = express();
const PORT = 8080;
const userRouter = require('./routes/userRouter.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', userRouter)

app.listen(PORT, (err) => {
    if (err) {
        return console.log('Houve um erro ao se conectar com o servidor: ' + err);
    }

    console.log(`Conectado com sucesso: http://localhost:${PORT}`);
});