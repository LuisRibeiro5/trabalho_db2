const { Sequelize, DataTypes } = require('sequelize');

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

const Country = sequelize.define('country', {
    country_id: { type: DataTypes.SMALLINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    country: { type: DataTypes.STRING(50), allowNull: false },
    last_update: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'country', timestamps: false });

const Address = sequelize.define('Address', {
    address_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    address: { type: DataTypes.STRING(50), allowNull: false },
    address2: { type: DataTypes.STRING(50), allowNull: true },
    district: { type: DataTypes.STRING(20), allowNull: true },
    city_id: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: true },
    postal_code: { type: DataTypes.STRING(10), allowNull: true },
    phone: { type: DataTypes.STRING(20), allowNull: true },
    location: { type: DataTypes.GEOMETRY('POINT'), allowNull: false },
    last_update: { type: DataTypes.DATE, allowNull: true }
}, { tableName: 'address', timestamps: false });

const City = sequelize.define('city', {
    city_id: { type: DataTypes.SMALLINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    city: { type: DataTypes.STRING(50), allowNull: false },
    country_id: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: false },
    last_update: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'city', timestamps: false });

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

async function cadastrarCidade(nomeCidade, idPais) {
    return await City.create({
        city: nomeCidade,
        country_id: idPais
    });
}

async function cadastrar_endereco(endereco, cidade) {
    await Address.create({
      address: endereco,       
      city_id: cidade,         
      district: '',           
      phone: '',              
      location: {            
        type: 'Point',
        coordinates: [0, 0]
      },
      address2: null,
      postal_code: null,
    });
  }
module.exports = {
    listarPaises,
    listarCidades,
    listarEnderecos,
    cadastrar_endereco, cadastrarPais, cadastrarCidade
}

