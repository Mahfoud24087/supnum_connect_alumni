const attempts = new Map();

/**
 * Progressive Lockout Middleware
 * 1-5 fails: No lockout
 * 5 fails: 30s lockout
 * 6-8 fails: No lockout (after 30s)
 * 8 fails total: 5m lockout
 * >8 fails: 15m lockout
 */
const progressiveAuthLimiter = (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const email = req.body.email || 'unknown';
    const key = `${ip}-${email}`;
    const now = Date.now();
    
    let data = attempts.get(key);
    
    // Initialize if first time
    if (!data) {
        data = { count: 0, lockoutUntil: 0 };
        attempts.set(key, data);
    }

    // Check if currently locked out
    if (data.lockoutUntil > now) {
        const remainingMs = data.lockoutUntil - now;
        let timeStr = '';
        
        if (remainingMs > 60000) {
            timeStr = `${Math.ceil(remainingMs / 60000)} minutes`;
        } else {
            timeStr = `${Math.ceil(remainingMs / 1000)} seconds`;
        }

        return res.status(429).json({ 
            message: `Too many login attempts, please try again after ${timeStr}` 
        });
    }

    // Intercept response to detect failed login
    const originalJson = res.json;
    res.json = function(body) {
        // Status 200/201 = Success
        if (res.statusCode >= 200 && res.statusCode < 300) {
            attempts.delete(key); // Reset on success
        } 
        // Status 401 = Unauthorized (Wrong password/email)
        else if (res.statusCode === 401) {
            data.count++;
            
            if (data.count === 5) {
                data.lockoutUntil = Date.now() + 30 * 1000; // 30 seconds
            } else if (data.count === 8) {
                data.lockoutUntil = Date.now() + 5 * 60 * 1000; // 5 minutes
            } else if (data.count > 8) {
                data.lockoutUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
            }
            
            attempts.set(key, data);
        }
        
        return originalJson.call(this, body);
    };

    next();
};

module.exports = progressiveAuthLimiter;
