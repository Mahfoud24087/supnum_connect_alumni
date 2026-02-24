const fs = require('fs');
const path = require('path');

const errorHandler = (err, req, res, next) => {
    const errorLog = `${new Date().toISOString()} - ${req.method} ${req.url} - ${err.stack}\n\n`;
    try {
        fs.appendFileSync(path.join(__dirname, '../error.log'), errorLog);
    } catch (e) {
        console.error('Failed to write to error log:', e);
    }
    console.error('Error:', err);

    // Sequelize Validation Error
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        const messages = err.errors.map(e => e.message);
        return res.status(400).json({ message: messages.join(', ') });
    }

    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
    }

    // Default Error
    res.status(err.statusCode || 500).json({
        message: err.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
