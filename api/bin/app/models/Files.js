const { Sequelize, Model } = require('sequelize');

class Files extends Model {
    static init(sequelize) {
        super.init(
            {
                original_name: Sequelize.STRING,
                name: Sequelize.STRING,
                size: Sequelize.STRING,
                extension: Sequelize.STRING,
                path: Sequelize.STRING,
            },
            {
                sequelize,
                modelName: 'Files',
                tableName: 'files',
            }
        );

        return this;
    }
}

module.exports = Files;
