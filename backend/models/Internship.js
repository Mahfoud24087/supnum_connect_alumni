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
        type: DataTypes.STRING,
        defaultValue: 'Internship'
    },
    workplaceType: {
        type: DataTypes.ENUM('On-site', 'Remote', 'Hybrid'),
        defaultValue: 'On-site'
    },
    targetAudience: {
        type: DataTypes.ENUM('All', 'Students', 'Graduates'),
        defaultValue: 'All'
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true
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
