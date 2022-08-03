const { expressjwt: jwt } = require("express-jwt");

function authJwt() {
    const secret = process.env.SECRET_TOKEN;
    return jwt(
        { secret: secret, algorithms: ["HS256"] }
    );
}

module.exports = authJwt;