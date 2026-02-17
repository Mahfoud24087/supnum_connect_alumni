const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Content cannot be empty' }
        }
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    type: {
        type: DataTypes.ENUM('post', 'question'),
        defaultValue: 'post'
    },
    reactions: {
        type: DataTypes.JSONB,
        defaultValue: [] // Array of { userId, type } e.g., 'like', 'love', 'haha', 'wow', 'sad', 'angry'
    },
    sharedPostId: {
        type: DataTypes.UUID,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Post;
