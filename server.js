const {
    listarPaises,
    listarCidades,
    listarEnderecos,
    cadastrar_endereco, 
    cadastrarPais, 
    cadastrarCidade
} = require('./main'); // Verifique se o arquivo onde está o Sequelize chama-se 'main.js'

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

// --- Configurações ---
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rota para testar se o servidor está online
app.get('/', (req, res) => {
    res.send('Servidor Backend Rodando!');
});

// --- Rotas de Listagem ---
app.get('/listarCidades', async (req, res) => {
    try {
        const dados = await listarCidades();
        res.json(dados);
    } catch (e) { res.status(500).json({ erro: e.message }); }
});

app.get('/listarPaises', async (req, res) => {
    try {
        const dados = await listarPaises();
        res.json(dados);
    } catch (e) { res.status(500).json({ erro: e.message }); }
});

app.get('/listarEnderecos', async (req, res) => {
    try {
        const dados = await listarEnderecos();
        res.json(dados);
    } catch (e) { res.status(500).json({ erro: e.message }); }
});

// --- Rotas de Cadastro (POST) ---

app.post('/cadastrar_pais', async (req, res) => {
    try {
        await cadastrarPais(req.body.pais);
        res.send('País cadastrado! <a href="http://localhost:5500/trabalho_db2/index.html">Voltar</a>');
    } catch (e) { res.status(500).send("Erro: " + e.message); }
});

app.post('/cadastrar_cidade', async (req, res) => {
    try {
        await cadastrarCidade(req.body.cidade, req.body.pais_cidade);
        res.send('Cidade cadastrada! <a href="http://localhost:5500/trabalho_db2/index.html">Voltar</a>');
    } catch (e) { res.status(500).send("Erro: " + e.message); }
});

app.post('/cadastrar_endereco', async (req, res) => {
    try {
        // Note que usamos cadastrar_endereco (com underline) conforme exportado no main.js
        await cadastrar_endereco(req.body.endereco, req.body.cidade_endereco);
        res.send('Endereço cadastrado! <a href="http://localhost:5500/trabalho_db2/index.html">Voltar</a>');
    } catch (e) { 
        console.error(e);
        res.status(500).send("Erro ao cadastrar endereço: " + e.message); 
    }
});

// --- Inicialização ---
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));