let Utilisateur = require('../models/utilisateur');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let cookie_perso = require('../models/cookie');

module.exports = {
    inscription_get: function (req, res) {
        res.render('inscription', {error: ""});
    },

    inscription_post: function (req, res) {

        var errors = [];

        const REGEX_MAIL = /(?:[a-z0-9!#$%&'+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;;

        var data = {
            nom_utilisateur: req.sanitize(req.body.nom),
            prenom_utilisateur: req.sanitize(req.body.prenom),
            mail_utilisateur: req.sanitize(req.body.mail),
            sexe_utilisateur: req.sanitize(req.body.sexe),
            type_utilisateur: 3,
            password_utilisateur: req.body.password,
            telephone_utilisateur: req.sanitize(req.body.telephone)
        };

        if (!REGEX_MAIL.test(data.mail_utilisateur)) {
            errors.push("Adresse mail invalide");
        }

        if (data.password_utilisateur.length >= 8) {
            data.password_utilisateur = bcrypt.hashSync(req.sanitize(data.password_utilisateur),10);
        }
        else {
            errors.push("Taille du mot de passe saisi insuffisante");
        }

        if (data.telephone_utilisateur.charAt(0) !== '0' || data.telephone_utilisateur.length > 10) {
            errors.push("Saisie du numéro de téléphone invalide");
        }

        Utilisateur.exist(data.mail_utilisateur, function (result) {
            if (result == 1) {
                errors.push("Mail déjà existant");
            }
        });

        if (errors.length === 0) {
            Utilisateur.create(data);
            res.redirect('/');
        }
        else {
            res.render('inscription', { errors });
        }
    },

    login_get: function (req, res) {
        res.render('login');
    },

    login_post: function (req, res) {
        Utilisateur.connect(req.body.mail, req.body.password, function (code_retour, user) {
            console.log("code retour : "+code_retour)
            if (code_retour === 1) {
                var jwt_token = jwt.sign({id_utilisateur: user.id_utilisateur, type_utilisateur: user.type_utilisateur}, cookie_perso.key(), {expiresIn: '2h'});
                cookie_perso.setToken(jwt_token, res);
                console.log("token : "+jwt_token)
                console.log("cookie : "+cookie_perso.getToken(req))
                res.redirect('/users/homepage');
            }
        });

    },

    homepage: function (req, res) {
        var token_decoded = jwt.verify(cookie_perso.getToken(req), cookie_perso.key());

        switch (token_decoded.type_utilisateur) {
            case 1:
                res.send("T'es un admin");
                break;
            case 2:
                res.send("T'es un vendeur");
                break;
            case 3:
                res.render('users/client/homepage');
                break;
        }
    }
}