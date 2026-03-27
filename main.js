const { Sequelize, DataTypes } = require('sequelize');

// Configuração do Banco de Dados
const HOST = "mysql-209830-0.cloudclusters.net";
const USER = "admin";
const PASSWORD = "81DvDok0";
const DATABASE = "sakila";
const PORT = 19121;

const sequelize = new Sequelize(DATABASE, USER, PASSWORD, { 
    host: HOST, 
    dialect: "mysql", 
    port: PORT, 
    logging: false 
});

// Definição dos Modelos (Tabelas)
const Country = sequelize.define('country', {
    country_id: { type: DataTypes.SMALLINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    country: { type: DataTypes.STRING(50), allowNull: false },
    last_update: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'country', timestamps: false });

const City = sequelize.define('city', {
    city_id: { type: DataTypes.SMALLINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    city: { type: DataTypes.STRING(50), allowNull: false },
    country_id: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: false },
    last_update: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'city', timestamps: false });

const Address = sequelize.define('Address', {
    address_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    address: { type: DataTypes.STRING(50), allowNull: false },
    address2: { type: DataTypes.STRING(50), allowNull: true },
    district: { type: DataTypes.STRING(20), allowNull: false },
    city_id: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: false },
    postal_code: { type: DataTypes.STRING(10), allowNull: true },
    phone: { type: DataTypes.STRING(20), allowNull: false },
    location: { type: DataTypes.GEOMETRY('POINT'), allowNull: true },
    last_update: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'address', timestamps: false });

// Relacionamentos (Chaves Estrangeiras)
City.belongsTo(Country, { foreignKey: 'country_id' });
Country.hasMany(City, { foreignKey: 'country_id' });

Address.belongsTo(City, { foreignKey: 'city_id' });
City.hasMany(Address, { foreignKey: 'city_id' });

// Funções de Listagem (Ordenadas do mais novo para o mais antigo)
async function listarPaises() {
    return await Country.findAll({ 
        raw: true,
        order: [['country_id', 'DESC']]
    });
}

async function listarCidades() {
    return await City.findAll({ 
        include: [Country],
        order: [['city_id', 'DESC']]
    });
}

async function listarEnderecos() {
    return await Address.findAll({
        include: [{ model: City, include: [Country] }],
        order: [['address_id', 'DESC']]
    });
}

// Funções de Cadastro (Evitando Duplicatas)
async function cadastrarPais(nomePais) {
    const [pais, criado] = await Country.findOrCreate({
        where: { country: nomePais },
        defaults: { country: nomePais }
    });
    if (!criado) throw new Error('Este país já está cadastrado!');
    return pais;
}

async function cadastrarCidade(nomeCidade, idPais) {
    const [cidade, criado] = await City.findOrCreate({
        where: { city: nomeCidade, country_id: idPais },
        defaults: { city: nomeCidade, country_id: idPais }
    });
    if (!criado) throw new Error('Esta cidade já está cadastrada para este país!');
    return cidade;
}

async function cadastrar_endereco(endereco, id_cidade) {
    const [addr, criado] = await Address.findOrCreate({
        where: { address: endereco, city_id: id_cidade },
        defaults: {
            address: endereco,
            city_id: id_cidade,
            district: 'N/A',
            phone: '00000000',
            location: { type: 'Point', coordinates: [0, 0] }
        }
    });
    if (!criado) throw new Error('Este endereço já existe nesta cidade!');
    return addr;
}

// Exportação de Módulos
module.exports = {
    listarPaises, listarCidades, listarEnderecos,
    cadastrar_endereco, cadastrarPais, cadastrarCidade
};