const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    class Interview extends Model {
        static associate(models) {
            // define associations
            Interview.belongsTo(models.Position, {
                foreignKey: 'position_id',
                as: 'position'
            });
        }
    }

    Interview.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: () => uuidv4(),
            primaryKey: true
        },
        position_id: {
            type: DataTypes.UUID,
            references: {
                model: 'positions',
                key: 'id'
            },
            allowNull: false
        },
        round: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        interviewer: {
            type: DataTypes.STRING,
            allowNull: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        result: {
            type: DataTypes.STRING,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'Interview',
        tableName: 'interviews',
        timestamps: false,
        underscored: true
    });

    return Interview;
};