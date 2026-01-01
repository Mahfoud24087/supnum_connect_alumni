const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Internship = sequelize.define('Internship', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Title is required' }
        }
    },
    company: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('Internship', 'Full-time', 'Part-time', 'Contract'),
        defaultValue: 'Internship'
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdById: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    customQuestions: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    requireCv: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    requireMessage: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    requirePhone: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
});

module.exports = Internship;
