function errorHandler() {
    return (err, req, res , next) => {
        if (err) {
            res.status(err.status).json({
                message: [err.code, err.name],
                error: err.inner.message
            });
        }
    }
}

module.exports = errorHandler;