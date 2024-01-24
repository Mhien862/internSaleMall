'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    // class reminders extends Model {
    //     /**
    //      * Helper method for defining associations.
    //      * This method is not a part of Sequelize lifecycle.
    //      * The `models/index` file will call this method automatically.
    //      */
    //     static associate(models) {
    //         // define association here
    //         reminders.hasOne(models.user_reminders, { foreignKey: 'role_id' })
    //     }
    // }
    const reminders = sequelize.define("reminders", {
        time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type_reminder: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            allowNull: false
        },
        send_to: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            allowNull: false
        },
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        sequelize,
        timestamps: false,
        modelName: 'reminders',
        tableName: 'reminders',
    });
    reminders.associate = (models) => {
        // define association here
        reminders.belongsTo(models.courses, { foreignKey: 'course_id' })
    }
    return reminders;
};