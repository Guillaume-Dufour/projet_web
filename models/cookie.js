const JWT_SIGN = "l6YdUvSoyS6HP4A7Hgd1I1RoG_VPIJFNNJToybpKDWISESKwZltjdnLHORlD2TiqEx9UGMzBkjbHEiy2T4j8OZPbGctO0GJ5mNpwGJbd";

class Cookie {

    static key() {
        return JWT_SIGN;
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

    static connect(req, res, id, type, cb) {
        var token = token.sign({
            id_utilisateur: id,
            type_utilisateur: type
        }, JWT_SIGN, { date_expiration: '2h' }
        );

        this.setToken(token, res);
        cb({
            check: req.cookies['secretToken'] !== undefined
        })
    }





}

module.exports = Cookie;