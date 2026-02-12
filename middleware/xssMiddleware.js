const xss = require('xss');

const clean = (data = '') => {
    return xss(data);
};

const sanitize = (obj) => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (typeof obj[key] === 'string') {
                obj[key] = clean(obj[key]);
            } else if (typeof obj[key] === 'object') {
                sanitize(obj[key]);
            }
        }
    }
    return obj;
};

const xssMiddleware = (req, res, next) => {
    if (req.body) req.body = sanitize(req.body);
    if (req.query) req.query = sanitize(req.query);
    if (req.params) req.params = sanitize(req.params);
    next();
};

module.exports = xssMiddleware;
