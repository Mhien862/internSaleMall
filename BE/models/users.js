'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    // class users extends Model {
    //     /**
    //      * Helper method for defining associations.
    //      * This method is not a part of Sequelize lifecycle.
    //      * The `models/index` file will call this method automatically.
    //      */
    //     // static associate(models) {
    //     //     // define association here
    //     //     users.hasOne(models.accounts, { foreignKey: 'user_id' })
    //     //     users.hasOne(models.user_roles, { foreignKey: 'user_id' })
    //     // }
    // }
    const users = sequelize.define("users", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: DataTypes.STRING,
        gender: DataTypes.STRING,
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        birthday: DataTypes.DATE,
        hired_date: DataTypes.DATE,
        role_id: DataTypes.INTEGER,
        address: DataTypes.STRING,
        grant: DataTypes.STRING,
        manager: DataTypes.STRING,
        start_working_time: DataTypes.STRING,
        end_working_time: DataTypes.STRING,
        access_token: DataTypes.STRING,
        avatar: DataTypes.STRING,
    }, {
        sequelize,
        timestamps: false,
        modelName: 'users',
        tableName: 'users',
    });
    users.associate = (models) => {
        users.hasOne(models.accounts, { foreignKey: 'user_id' })
        users.hasMany(models.users_courses, { foreignKey: 'user_id' })
        users.belongsTo(models.roles, { foreignKey: 'role_id' })
        users.hasOne(models.user_details, { foreignKey: 'user_id' })
        users.hasMany(models.lessons, { foreignKey: 'trainer' })
        users.hasOne(models.courses, { foreignKey: 'manager' })
        users.hasOne(models.courses, { foreignKey: 'create_by' })
    }
    return users;
};