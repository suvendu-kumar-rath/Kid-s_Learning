const sendResponse = (req, res, next) => {
    res.success = (status, success, message, data = {}) => {
        return res.status(status).json({
            status,
            success,
            message,
            data
        });
    };

    res.error = (status, success, message, error = null) => {
        return res.status(status).json({
            status,
            success,
            message,
            error
        });
    };

    next();
};

module.exports = sendResponse;
