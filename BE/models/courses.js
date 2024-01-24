'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const courses = sequelize.define("courses", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        training_form: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        manager: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        create_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: DataTypes.STRING,
        from_date: DataTypes.DATE,
        to_date: DataTypes.DATE,
        fee: DataTypes.STRING,
        color: DataTypes.STRING,
        summary: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        training_location: DataTypes.TEXT,
        progress: DataTypes.INTEGER,
        lessons: DataTypes.INTEGER
    }, {
        sequelize,
        timestamps: false,
        modelName: 'courses',
        tableName: 'courses',
    });
    courses.associate = (models) => {
        courses.hasMany(models.users_courses, { foreignKey: 'course_id' })
        courses.hasMany(models.categories, { foreignKey: 'course_id' })
        courses.hasMany(models.reminders, { foreignKey: 'course_id' })
        courses.hasMany(models.technology_courses, { foreignKey: 'course_id' })
        courses.belongsTo(models.users, { foreignKey: 'manager', as: 'courses_manager' })
        courses.belongsTo(models.users, { foreignKey: 'create_by', as: 'courses_create_by' })
    }
    return courses;
};