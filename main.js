const { Sequelize, DataTypes } = require('sequelize');

const HOST = "mysql-209528-0.cloudclusters.net";
const USER = "aula";
const PASSWORD = "aula";
const DATABASE = "sakila";
const PORT = 10052;

const sequelize = new Sequelize(DATABASE, USER, PASSWORD, { 
    host: HOST, 
    dialect: "mysql", 
    port: PORT, 
    logging: false 
});

// --- Modelos ---

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
    district: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'N/A' }, 
    city_id: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: false },
    phone: { type: DataTypes.STRING(20), allowNull: false, defaultValue: '000' },
    last_update: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'address', timestamps: false });

// --- Relacionamentos (Requisito A) ---
City.belongsTo(Country, { foreignKey: 'country_id' });
Country.hasMany(City, { foreignKey: 'country_id' });
Address.belongsTo(City, { foreignKey: 'city_id' });
City.hasMany(Address, { foreignKey: 'city_id' });

// --- Listagens (Requisito B) ---

async function listarPaises() {
    return await Country.findAll({ raw: true });
}

async function listarCidades() {
    return await City.findAll({ include: [Country] });
}

async function listarEnderecos() {
    return await Address.findAll({
        include: [{ model: City, include: [Country] }]
    });
}

// --- Inserções (Requisito C) ---

async function cadastrarPais(nomePais) {
    return await Country.create({ country: nomePais });
}

async function cadastrarCidade(nomeCidade, nomePais) {
    return await City.create({
        city: nomeCidade,
        country: { country: nomePais } // Cria o país junto
    }, { include: [Country] });
}

async function cadastrarEndereco(rua, nomeCidade, nomePais) {
    return await Address.create({
        address: rua,
        city: {
            city: nomeCidade,
            country: { country: nomePais }
        }
    }, { 
        include: [{ model: City, include: [Country] }] 
    });
}

module.exports = {
    listarPaises, listarCidades, listarEnderecos,
    cadastrarPais, cadastrarCidade, cadastrarEndereco
};