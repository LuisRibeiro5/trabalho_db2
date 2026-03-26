const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

const { 
    listarEnderecos, listarCidades, listarPaises, 
    cadastrarPais, inserirCidade, inserirEndereco 
} = require('./main');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- Rotas de Listagem ---
app.get('/listarCidades', async (req, res) => {
    const dados = await listarCidades();
    res.json(dados);
});

app.get('/listarPaises', async (req, res) => {
    const dados = await listarPaises();
    res.json(dados);
});

app.get('/listarEnderecos', async (req, res) => {
    const dados = await listarEnderecos();
    res.json(dados);
});

// --- Rotas de Cadastro (POST) ---
app.post('/cadastrar_pais', async (req, res) => {
    try {
        await cadastrarPais(req.body.pais);
        res.send('País cadastrado! <a href="/trabalho_db2/">Voltar</a>');
    } catch (e) { res.status(500).send(e.message); }
});

app.post('/cadastrar_cidade', async (req, res) => {
    try {
        await cadastrarCidade(req.body.cidade, req.body.pais_cidade);
        res.send('Cidade cadastrada! <a href="/trabalho_db2/">Voltar</a>');
    } catch (e) { res.status(500).send(e.message); }
});

app.post('/cadastrar_endereco', async (req, res) => {
    try {
        await cadastrarEndereco(req.body.endereco, req.body.cidade_endereco, req.body.pais_endereco);
        res.send('Endereço completo cadastrado! <a href="5500/trabalho_db2/">Voltar</a>');
    } catch (e) { res.status(500).send(e.message); }
});

app.listen(PORT, () => console.log(`Servidor em http://localhost:${PORT}`));