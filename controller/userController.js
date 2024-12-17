const bcrypt = require('bcryptjs');
const {validatePassword} = require('./validations.js');
const client = require('../models/db.js');

module.exports = {

    login: async (req, res) => {
        //Alterar se necessário
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(401).json({ message: "Preencha todos os campos corretamente" })
        }

        try {
            const searchUser = await client.query('SELECT * FROM accounts WHERE username = $1 ', [username]);
            const user = await searchUser.rows[0]

            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado.", sucess: false });
            }

            const verifyPassord = await bcrypt.compare(password, user.password);

            if (!verifyPassord) {
                return res.status(401).json({ message: "ID ou senha incorretos, verifique e tente novamente.", sucess: false })
            }

            return res.status(200).json({ message: "Login bem-sucedido.", user: user });

        } catch (err) {
            console.error(`Houve um erro ao realizar login: ${err}`);
            return res.status(500).json({ message: "Erro ao realizar o login." });
        }
    },

    signup: async (req, res) => {
        const { name, username, password, confirmPassword } = req.body;

        if (!name || !username || !password || !confirmPassword) {
            return res.status(400).json({ message: "Todos os campos devem estar preenchidos." });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({ message: "A senha deve conter apenas números." });
        }

        if (password != confirmPassword) {
            return res.status(409).json({ messsage: "As senhas devem ser iguais." });
        }

        try {
            const searchUser = await client.query(`SELECT * FROM accounts WHERE username = $1 `, [username]);

            const user = searchUser.rows[0];

            if (!user) {

                // Criptografar a senha
                const hashedPassword = await bcrypt.hash(password, 10);

                const insert = await client.query('INSERT INTO accounts (name, username, password) VALUES ($1, $2, $3) RETURNING *', [name, username, hashedPassword]);

                return res.status(201).json({ message: 'Usuário cadastrado com sucesso.', sucess: true, user: insert.rows[0] });
            }

            return res.status(409).json({ message: "Não foi possível concluir a operação, pois o ID informado já existe.", })

        } catch (err) {
            console.log(`Houve um erro ao tentar registrar o usuário: ${err}`);
            res.status(500).json({ message: `Ocorreu um erro ao registrar o usuário, tente novamente mais tarde.` });
        }

    },

    cancelSignup: (req, res) => {
        res.status(200).json({ message: "A operação foi cancelada pelo usuário", sucess: true })
    }

}