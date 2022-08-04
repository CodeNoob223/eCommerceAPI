function errorHandler() {
    return (err, req, res , next) => {
        if (err) {
            return res.status(err.status).json({
                type: err.name,
                message: err.code,
                error: err.inner.message
            });
        }
    }
}

module.exports = errorHandler;