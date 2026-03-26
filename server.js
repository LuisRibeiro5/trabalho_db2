const {
    listarPaises, listarCidades, listarEnderecos,
    cadastrar_endereco, cadastrarPais, cadastrarCidade
} = require('./main');

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

// --- Rotas de Cadastro (Agora respondendo texto limpo para o alert) ---

app.post('/cadastrar_pais', async (req, res) => {
    try {
        await cadastrarPais(req.body.pais);
        res.status(201).send('País cadastrado com sucesso!');
    } catch (e) { 
        res.status(500).send(e.message); 
    }
});

app.post('/cadastrar_cidade', async (req, res) => {
    try {
        await cadastrarCidade(req.body.cidade, req.body.pais_cidade);
        res.status(201).send('Cidade cadastrada com sucesso!');
    } catch (e) { 
        res.status(500).send(e.message); 
    }
});

app.post('/cadastrar_endereco', async (req, res) => {
    try {
        await cadastrar_endereco(req.body.endereco, req.body.cidade_endereco);
        res.status(201).send('Endereço cadastrado com sucesso!');
    } catch (e) { 
        res.status(500).send(e.message); 
    }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));