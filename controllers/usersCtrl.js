let Utilisateur = require('../models/utilisateur');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let token = require('../models/token');

module.exports = {
    inscription_get: function (req, res) {
        res.render('inscription', {errors: [], data: ""});
    },

    inscription_post: async function (req, res) {

        var errors = [];

        const REGEX_MAIL = /(?:[a-z0-9!#$%&'+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

        var data = {
            nom_utilisateur: req.sanitize(req.body.nom.toUpperCase()),
            prenom_utilisateur: req.sanitize(req.body.prenom.charAt(0).toUpperCase()+req.body.prenom.slice(1)),
            mail_utilisateur: req.sanitize(req.body.mail),
            sexe_utilisateur: req.sanitize(req.body.sexe),
            type_utilisateur: 3,
            password_utilisateur: req.body.password,
            telephone_utilisateur: req.sanitize(req.body.telephone)
        };

        if (data.sexe_utilisateur === undefined) {
            errors.push("Aucun titre de civilité n'a été coché")
        }

        if (data.nom_utilisateur.length > 100) {
            errors.push("Le nom saisi est trop long (100 caractères maximum)");
            delete data.nom_utilisateur;
        }

        if (data.prenom_utilisateur.length > 100) {
            errors.push("Le prénom saisi est trop long (100 caractères maximum)");
            delete data.prenom_utilisateur;
        }

        if (!REGEX_MAIL.test(data.mail_utilisateur)) {
            errors.push("Adresse mail invalide");
            delete data.mail_utilisateur;
        }

        if (data.password_utilisateur.length >= 8) {
            data.password_utilisateur = bcrypt.hashSync(req.sanitize(data.password_utilisateur),10);
        }
        else {
            errors.push("Taille du mot de passe saisi insuffisante");
            delete data.password_utilisateur;
        }

        if (data.telephone_utilisateur !== undefined) {
            if (data.telephone_utilisateur.charAt(0) !== '0' || data.telephone_utilisateur.length > 10) {
                errors.push("Saisie du numéro de téléphone invalide");
                delete data.telephone_utilisateur;
            }
        }

        Utilisateur.exist(data.mail_utilisateur, function(result) {
            if (result === 1) {
                errors.push("Mail déjà existant");
                delete data.mail_utilisateur;
            }

            if (errors.length === 0) {
                Utilisateur.create(data);
                res.redirect('/users/login');
            }
            else {
                delete data.password_utilisateur;
                res.render('inscription', { errors : errors, data: data });
            }
        })



    },

    login_get: function (req, res) {
        res.render('login', {error: undefined, mail: undefined});
    },

    login_post: function (req, res) {
        Utilisateur.canConnect(req.body.mail, req.body.password, function (code_retour, user) {

            switch (code_retour) {
                case -3:
                    res.render('login', {error: "Le compte n'est pas actif", mail: undefined});
                    break;
                case -2:
                    res.render('login', {error: "Vous n'avez pas renseigné tous les champs requis", mail: undefined});
                    break;
                case -1:
                    res.render('login', {error: "Le mail n'existe pas", mail: undefined});
                    break;
                case 0:
                    res.render('login', {error: "Le mot de passe est incorrect", mail: req.body.mail});
                    break;
                case 1:
                    var jwt_token = jwt.sign({id_utilisateur: user.id_utilisateur, type_utilisateur: user.type_utilisateur}, token.key(), {expiresIn: '2h'});
                    token.setToken(jwt_token, res);
                    res.redirect('/users/homepage');
                    break;
                default:
                    res.redirect('/users/login');
            }
        });

    },

    homepage: function (req, res) {

        if (req.cookies['secretToken'] !== undefined) {
            var token_decoded = jwt.verify(token.getToken(req), token.key());
            console.log(token_decoded)

            switch (token_decoded.type_utilisateur) {
                case 1:
                    res.redirect('/users/admin/homepage');
                    break;
                case 2:
                    res.redirect('/users/vendeur/homepage');
                    break;
                case 3:
                    res.redirect('/users/client/homepage');
                    break;
                default:
                    res.redirect('/users/login');
            }
        }
        else {
            res.redirect('/users/login')
        }

    },

    profil: function (req, res) {

        if (req.cookies['secretToken'] !== undefined) {
            var token_decoded = jwt.verify(token.getToken(req), token.key());
            console.log(token_decoded)

            switch (token_decoded.type_utilisateur) {
                case 1:
                    res.redirect('/users/admin/profil');
                    break;
                case 2:
                    res.redirect('/users/vendeur/profil');
                    break;
                case 3:
                    res.redirect('/users/client/profil');
                    break;
                default:
                    res.redirect('/users/login');
            }
        }
        else {
            res.redirect('/users/login')
        }
    },

    deconnect: function (req, res) {
        res.clearCookie('secretToken');
        res.redirect('/users/login');
    }
}