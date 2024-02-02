const { Sequelize, Model } = require('sequelize');
const bcrypt = require('bcrypt');

class Users extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                surname: Sequelize.STRING,
                login: Sequelize.STRING,
                password: Sequelize.VIRTUAL,
                password_hash: Sequelize.STRING,
                file_id: Sequelize.STRING,
                actived: Sequelize.BOOLEAN,
            },
            {
                sequelize,
                modelName: 'Users',
                tableName: 'users',
            }
        );

        this.addHook('beforeSave', async (user) => {
            this.password_hash = await bcrypt.hash(user.password, 12);
        });

        return this;
    }

    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }

    static association(models) {
        this.belongsTo(models.Files, { foreignKey: 'file_id', key: 'id', as: 'picture' })
    }

}

module.exports = Users;
