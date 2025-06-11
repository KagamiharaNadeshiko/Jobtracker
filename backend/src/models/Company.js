const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    class Company extends Model {
        static associate(models) {
            // define associations
            Company.belongsTo(models.Industry, {
                foreignKey: 'industry_id',
                as: 'industry'
            });

            Company.hasMany(models.Position, {
                foreignKey: 'company_id',
                as: 'positions'
            });
        }
    }

    Company.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: () => uuidv4(),
            primaryKey: true
        },
        industry_id: {
            type: DataTypes.UUID,
            references: {
                model: 'industries',
                key: 'id'
            },
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'Company',
        tableName: 'companies',
        timestamps: false,
        underscored: true
    });

    return Company;
};