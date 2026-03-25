const { Sequelize, DataTypes, Op, Model } = require('sequelize');
const HOST = "mysql-209528-0.cloudclusters.net";
const USER = "aula";            // usuário do banco
const PASSWORD = "aula";         // senha
const DATABASE = "sakila";   // nome da base de dados
const PORT = 10052;              // porta padrão do MySQL
const sequelize = new Sequelize(DATABASE, USER, PASSWORD, { host: HOST, dialect: "mysql", port: PORT, logging: false}); //coloquei o loggin ele faz os comandos SELECT de aparecer


const Address = sequelize.define('Address', {
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
    last_update: { type: DataTypes.DATE, allowNull: false }
}, { tableName: 'city', timestamps: false });

const Country = sequelize.define('country', {
    country_id: { type: DataTypes.SMALLINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    country: { type: DataTypes.STRING(50), allowNull: false },
    last_update: { type: DataTypes.DATE, allowNull: false }
}, { tableName: 'country', timestamps: false });

City.belongsTo(Country, { foreignKey: 'country_id' });
Country.hasMany(City, { foreignKey: 'country_id' });
Address.belongsTo(City, { foreignKey: 'city_id' });
City.hasMany(Address, { foreignKey: 'city_id' });


async function listarPaises() {
    try {
        const countries = await Country.findAll({
            raw: true
        });

        return countries;
    } catch (err) {
        console.error("Erro:", err);
    }
}

async function listarCidades() {
    try{
        const cidades = await City.findAll({
            include: [{
                model: Country  
            }],
            raw: true
        });
        return cidades;
    }catch(err){
        console.error("Erro", err)
    }
}
async function listarEnderecos() {
    try {
        const enderecos = await Address.findAll({
            include: [{
                model: City,     
                include: [Country]
            }],
            raw: true,
        });

        return enderecos;
    } catch (err) {
        console.error("Erro", err);
    }   
}

async function inserirPais(pais) {
    try {
        const country = {
            country: pais
        }
        Country.create(country)
    }catch(error) {
        console.error("Erro", error);
    }
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
    cadastrar_endereco
}
//listarDadosCompletos()
//listarCidades();
//listarPaises();
//listarDadosCompletos2();
