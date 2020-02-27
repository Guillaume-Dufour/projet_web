const JWT_KEY = "l6YdUvSoyS6HP4A7Hgd1I1RoG_VPIJFNNJToybpKDWISESKwZltjdnLHORlD2TiqEx9UGMzBkjbHEiy2T4j8OZPbGctO0GJ5mNpwGJbd";

class Token {

    static key() {
        return JWT_KEY;
    }

    static setToken(token, res) {
        return res.cookie('secretToken', token, { maxAge : 5 * 3600 * 1000});
    }

    static getToken(req) {
        return req.cookies['secretToken'];
    }

    static destroyToken(req, res) {
        return res.clearCookie('secretToken');
    }
}

module.exports = Token;