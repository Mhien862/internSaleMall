'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    // class accounts extends Model {
    //     /**
    //      * Helper method for defining associations.
    //      * This method is not a part of Sequelize lifecycle.
    //      * The `models/index` file will call this method automatically.
    //      */
    //     static associate(models) {
    //         // define association here
    //         accounts.belongsTo(models.users, { foreignKey: 'user_id' })
    //     }
    // }
    const accounts = sequelize.define("accounts", {
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hash_key: DataTypes.STRING,
        token: DataTypes.STRING,
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING
        }
    }, {
        sequelize,
        timestamps: false,
        modelName: 'accounts',
        tableName: 'accounts',
    });
    accounts.associate = (models) => {
        // define association here
        accounts.belongsTo(models.users, { foreignKey: 'user_id' })
    }
    return accounts;
};