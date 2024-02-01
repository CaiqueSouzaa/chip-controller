const { Sequelize } = require('sequelize');

const databaseConfig = require('../config/database.cjs');

const Status = require('../app/models/Status');

const models = [Status];

class Database {
    constructor() {
        this.connection = new Sequelize(databaseConfig);

        this.init();
    }

    init() {
        models.map((model) => model.init(this.connection)).map((model) => model.association && model.association(this.connection.models));
    }
}

module.exports = new Database();