'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    // class roles extends Model {
    //     /**
    //      * Helper method for defining associations.
    //      * This method is not a part of Sequelize lifecycle.
    //      * The `models/index` file will call this method automatically.
    //      */
    //     static associate(models) {
    //         // define association here
    //         roles.hasOne(models.user_roles, { foreignKey: 'role_id' })
    //     }
    // }
    const roles = sequelize.define("roles", {
        name: DataTypes.STRING,
    }, {
        sequelize,
        timestamps: false,
        modelName: 'roles',
        tableName: 'roles',
    });
    roles.associate = (models) => {
        // define association here
        roles.hasOne(models.users, { foreignKey: 'role_id' })
    }
    return roles;
};