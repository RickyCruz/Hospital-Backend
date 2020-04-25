const jwt = require('jsonwebtoken');

exports.verifyToken = function (request, response, next) {
    let token = request.query.token;

    jwt.verify(token, process.env.JWT_SEED, (error, decoded) => {
        if (error) {
            return response.status(401).json({
                success: false,
                message: 'Unauthorized',
                errors: error
            });
        }

        request.user = decoded.user;

        next();
    });
};

exports.isAdmin = function (request, response, next) {
    let user = request.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return response.status(401).json({
            success: false,
            message: 'Unauthorized',
            errors: { message: 'You cannot perform this action' }
        });
    }
};
