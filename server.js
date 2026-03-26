const  {
    listarPaises,
    listarCidades,
    listarEnderecos,
    cadastrar_endereco, cadastrarPais, cadastrarCidade, cadastrarEndereco
} = require('./main')

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const path = require('path');


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

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
<<<<<<< HEAD
        res.send('País cadastrado! <a href="http://localhost:5500/trabalho_db2/index.html"> Voltar</a>');
=======
        res.send('País cadastrado! <a href="/">Voltar</a>');
>>>>>>> 89a66d6aadeecca5232cb403f27919f16dce52a9
    } catch (e) { res.status(500).send(e.message); }
});

app.post('/cadastrar_cidade', async (req, res) => {
    try {
        await cadastrarCidade(req.body.cidade, req.body.pais_cidade);
<<<<<<< HEAD
        res.send('Cidade cadastrada! <a href="http://localhost:5500/trabalho_db2/index.html">Voltar</a>');
=======
        res.send('Cidade cadastrada! <a href="/">Voltar</a>');
>>>>>>> 89a66d6aadeecca5232cb403f27919f16dce52a9
    } catch (e) { res.status(500).send(e.message); }
});

app.post('/cadastrar_endereco',async (req, res) => {
    try {
<<<<<<< HEAD
        await cadastrarEndereco(req.body.endereco, req.body.cidade_endereco, req.body.pais_endereco);
        res.send('Endereço completo cadastrado! <a href="http://localhost:5500/trabalho_db2/index.html">Voltar</a>');
    } catch (e) { res.status(500).send(e.message); }
});
=======
        await cadastrar_endereco(req.body.endereco, req.body.cidade_endereco);
        res.status(200).send('Endereco cadastrado! <a href="/">Voltar</a>');
    } catch(err) {
        console.error(err);
    }

})

>>>>>>> 89a66d6aadeecca5232cb403f27919f16dce52a9

app.listen(PORT, () => console.log(`Servidor em http://localhost:${PORT}`));