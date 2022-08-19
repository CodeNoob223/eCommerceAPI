const { expressjwt: jwt } = require("express-jwt");

function authJwt() {
    const secret = process.env.SECRET_TOKEN;
    const api = process.env.API_URL;
    return jwt(
        { secret: secret, algorithms: ["HS256"], isRevoked: isRevoked }
    ).unless(
        {
            path: [
                `${api}/users/login`, 
                `${api}/users/register`,
                {url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"]},
                {url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"]}
            ]
        }
    );
}

async function isRevoked(req, token, callBack) {
    if (!token.payload.isAdmin) {
        return true;
    }

    return false;
}

module.exports = authJwt;