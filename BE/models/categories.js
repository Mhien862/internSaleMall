'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    // class categories extends Model {
    //     /**
    //      * Helper method for defining associations.
    //      * This method is not a part of Sequelize lifecycle.
    //      * The `models/index` file will call this method automatically.
    //      */
    //     static associate(models) {
    //         // define association here
    //         categories.hasOne(models.user_categories, { foreignKey: 'role_id' })
    //     }
    // }
    const categories = sequelize.define("categories", {
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
        },
    }, {
        sequelize,
        timestamps: false,
        modelName: 'categories',
        tableName: 'categories',
    });
    categories.associate = (models) => {
        // define association here
        categories.hasMany(models.lessons, { foreignKey: 'category_id' })
        categories.belongsTo(models.courses, { foreignKey: 'course_id' })
    }
    return categories;
};