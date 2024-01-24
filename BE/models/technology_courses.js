'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const technology_courses = sequelize.define("technology_courses", {
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        technology_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        timestamps: false,
        modelName: 'technology_courses',
        tableName: 'technology_courses',
    });
    technology_courses.associate = (models) => {
        // define association here
        technology_courses.belongsTo(models.technologies, { foreignKey: 'technology_id' })
        technology_courses.belongsTo(models.courses, { foreignKey: 'course_id' })
    }
    return technology_courses;
};