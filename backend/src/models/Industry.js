const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    class Industry extends Model {
        static associate(models) {
            // define associations
            Industry.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });

            Industry.hasMany(models.Company, {
                foreignKey: 'industry_id',
                as: 'companies'
            });
        }
    }

    Industry.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: () => uuidv4(),
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID,
            references: {
                model: 'users',
                key: 'id'
            },
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'Industry',
        tableName: 'industries',
        timestamps: false,
        underscored: true
    });

    return Industry;
};