const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied: Requires Admin privileges' });
    }
};

module.exports = adminMiddleware;
