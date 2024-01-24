'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    // class technologies extends Model {
    //     /**
    //      * Helper method for defining associations.
    //      * This method is not a part of Sequelize lifecycle.
    //      * The `models/index` file will call this method automatically.
    //      */
    //     static associate(models) {
    //         // define association here
    //         technologies.hasOne(models.user_technologies, { foreignKey: 'role_id' })
    //     }
    // }
    const technologies = sequelize.define("technologies", {
        name: DataTypes.STRING,
    }, {
        sequelize,
        timestamps: false,
        modelName: 'technologies',
        tableName: 'technologies',
    });
    technologies.associate = (models) => {
        // define association here
        technologies.hasMany(models.technology_courses, { foreignKey: 'technology_id' })
    }
    return technologies;
};