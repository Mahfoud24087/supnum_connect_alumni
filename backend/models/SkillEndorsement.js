const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SkillEndorsement = sequelize.define('SkillEndorsement', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    skillName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    endorserId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['skillName', 'endorserId', 'userId']
        }
    ]
});

module.exports = SkillEndorsement;
