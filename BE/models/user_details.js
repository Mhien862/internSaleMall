'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const user_details = sequelize.define("user_details", {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        basic_information: DataTypes.JSON,
        identify_information: DataTypes.JSON,
        education_information: DataTypes.JSON,
        other_information: DataTypes.JSON,
    }, {
        sequelize,
        timestamps: false,
        modelName: 'user_details',
        tableName: 'user_details',
    });
    user_details.associate = (models) => {
        // define association here
        user_details.belongsTo(models.users, { foreignKey: 'user_id' })
    }
    return user_details;
};