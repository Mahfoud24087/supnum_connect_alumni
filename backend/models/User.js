const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Name is required' }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: { msg: 'Please provide a valid email' }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [6, 100],
                msg: 'Password must be at least 6 characters'
            }
        }
    },
    supnumId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    role: {
        type: DataTypes.ENUM('student', 'graduate', 'admin', 'other', 'company'),
        defaultValue: 'student'
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Verified', 'Suspended'),
        defaultValue: 'Pending'
    },
    avatar: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    bio: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    location: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    phone: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    birthday: {
        type: DataTypes.DATE,
        allowNull: true
    },
    workStatus: {
        type: DataTypes.ENUM('employed', 'seeking', 'studying', 'freelance', 'other',''),
        defaultValue: ''
    },
    jobTitle: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    company: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    socialLinkedin: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    socialGithub: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    socialFacebook: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    cvUrl: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    gallery: {
        type: DataTypes.JSONB,
        defaultValue: []
    },
    graduationYear: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    specialty: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    website: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    industry: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    foundationYear: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    contactEmail: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    socialTwitter: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    socialYoutube: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    skills: {
        type: DataTypes.JSONB,
        defaultValue: []
    }
}, {
    timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

// Instance method to compare password
User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get user without password
User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;

    // Convert social fields to object
    values.social = {
        linkedin: values.socialLinkedin || '',
        github: values.socialGithub || '',
        facebook: values.socialFacebook || '',
        twitter: values.socialTwitter || '',
        youtube: values.socialYoutube || ''
    };
    delete values.socialLinkedin;
    delete values.socialGithub;
    delete values.socialFacebook;
    delete values.socialTwitter;
    delete values.socialYoutube;

    // Include new fields
    values.cvUrl = values.cvUrl || null;
    values.gallery = values.gallery || [];

    return values;
};

module.exports = User;
