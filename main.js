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

const Country = sequelize.define('country', {
    country_id: { type: DataTypes.SMALLINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    country: { type: DataTypes.STRING(50), allowNull: false },
    last_update: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'country', timestamps: false });

const Address1 = sequelize.define('Address', {
    address_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    address: { type: DataTypes.STRING(50), allowNull: false },
    address2: { type: DataTypes.STRING(50), allowNull: true },
    district: { type: DataTypes.STRING(20), allowNull: true },
    city_id: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: true },
    postal_code: { type: DataTypes.STRING(10), allowNull: true },
    phone: { type: DataTypes.STRING(20), allowNull: true },
    location: { type: DataTypes.GEOMETRY('POINT'), allowNull: true },
    last_update: { type: DataTypes.DATE, allowNull: true }
}, { tableName: 'address', timestamps: false });

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
        location: { type: 'Point', coordinates: [0, 0] },  // valor padrão para location
        city: {
            city: nomeCidade,
            country: { country: nomePais }
        }
    }, { 
        include: [{ model: City, include: [Country] }] 
    });
}

async function cadastrar_endereco(endereco, cidade) {
    await Address.create({
      address: endereco,       // obrigatório, passado como parâmetro
      city_id: cidade,         // obrigatório, passado como parâmetro
      district: '',            // obrigatório, string vazia como padrão
      phone: '',               // obrigatório, string vazia como padrão
      location: {              // obrigatório, ponto 0,0 como padrão (geométrico)
        type: 'Point',
        coordinates: [0, 0]
      },
      // Campos opcionais (podem ser omitidos ou nulos)
      address2: null,
      postal_code: null,
      // last_update é gerado automaticamente pelo banco
    });
  }
module.exports = {
    listarPaises,
    listarCidades,
    listarEnderecos,
    cadastrar_endereco, cadastrarPais, cadastrarCidade, cadastrarEndereco
}

