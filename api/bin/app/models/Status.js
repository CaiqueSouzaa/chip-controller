const { Sequelize, Model } = require('sequelize');

class Status extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
            },
            {
                sequelize,
                modelName: 'Status',
                tableName: 'status',
            }
        );

        return this;
    }
}

module.exports = Status;
