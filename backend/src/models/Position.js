const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    class Position extends Model {
        static associate(models) {
            // define associations
            Position.belongsTo(models.Company, {
                foreignKey: 'company_id',
                as: 'company'
            });

            Position.hasMany(models.Interview, {
                foreignKey: 'position_id',
                as: 'interviews'
            });
        }
    }

    Position.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: () => uuidv4(),
            primaryKey: true
        },
        company_id: {
            type: DataTypes.UUID,
            references: {
                model: 'companies',
                key: 'id'
            },
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        applied_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        es_text: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: []
        },
        test_deadline: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        test_type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        test_progress: {
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
        modelName: 'Position',
        tableName: 'positions',
        timestamps: false,
        underscored: true
    });

    return Position;
};