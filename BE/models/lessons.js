'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    // class lessons extends Model {
    //     /**
    //      * Helper method for defining associations.
    //      * This method is not a part of Sequelize lifecycle.
    //      * The `models/index` file will call this method automatically.
    //      */
    //     static associate(models) {
    //         // define association here
    //         lessons.hasOne(models.user_lessons, { foreignKey: 'role_id' })
    //     }
    // }
    const lessons = sequelize.define("lessons", {
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
        },
        date: {
            type: DataTypes.DATE,
        },
        duration: {
            type: DataTypes.STRING,
        },
        trainer: {
            type: DataTypes.INTEGER,
        },
        status: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
        },
        document_status: {
            type: DataTypes.STRING,
        },
    }, {
        sequelize,
        timestamps: false,
        modelName: 'lessons',
        tableName: 'lessons',
    });
    lessons.associate = (models) => {
        // define association here
        lessons.belongsTo(models.categories, { foreignKey: 'category_id' })
        lessons.belongsTo(models.users, { foreignKey: 'trainer' })
    }
    return lessons;
};