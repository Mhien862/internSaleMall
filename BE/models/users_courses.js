'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const users_courses = sequelize.define("users_courses", {
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        timestamps: false,
        modelName: 'users_courses',
        tableName: 'users_courses',
    });
    users_courses.associate = (models) => {
        // define association here
        users_courses.belongsTo(models.users, { foreignKey: 'user_id' })
        users_courses.belongsTo(models.courses, { foreignKey: 'course_id' })
    }
    return users_courses;
};