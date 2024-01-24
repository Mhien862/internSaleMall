'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    // class user_roles extends Model {
    //     /**
    //      * Helper method for defining associations.
    //      * This method is not a part of Sequelize lifecycle.
    //      * The `models/index` file will call this method automatically.
    //      */
    //     static associate(models) {
    //         // define association here
    //         user_roles.belongsTo(models.users, { foreignKey: 'user_id' })
    //         user_roles.belongsTo(models.roles, { foreignKey: 'role_id' })
    //     }
    // }
    const user_roles = sequelize.define("user_roles", {
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        timestamps: false,
        modelName: 'user_roles',
        tableName: 'user_roles',
    });
    user_roles.associate = (models) => {
        // define association here
        user_roles.belongsTo(models.users, { foreignKey: 'user_id' })
        user_roles.belongsTo(models.roles, { foreignKey: 'role_id' })
    }
    return user_roles;
};