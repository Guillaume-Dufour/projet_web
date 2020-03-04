let Utilisateur = require('../models/utilisateur');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let Token = require('../models/token');

module.exports = {
    homepage: function (req, res) {
        res.render('users/admin/homepage');
    },

    profil: function (req, res) {

        let token_decoded = jwt.verify(req.cookies['secretToken'], Token.key());
        Utilisateur.getUserById(token_decoded.id_utilisateur, function (row) {
            res.render('users/profil', {user: row});
        })

    },

    delete_infos_user: function (req, res) {
        Utilisateur.deleteInfos(req.body.id_utilisateur);
        res.end();
    },

    list_users: function (req, res) {
        Utilisateur.all(function (rows) {

            for (let i = 0; i < rows.length; i++) {
                if (rows[i].sexe_utilisateur === 1) {
                    rows[i].titre = "M.";
                }
                else {
                    rows[i].titre = "Mme";
                }

                if (rows[i].telephone_utilisateur === null) {
                    rows[i].telephone_utilisateur="Numéro de télephone non renseigné";
                }
            }

            res.render('users/admin/list_users', {utilisateurs: rows});
        })
    },

    create_vendeur_get: function (req, res) {
        res.render('users/vendeur/create', {errors: [], data: ""});
    },

    create_vendeur_post: function (req, res) {

        var errors = [];

        const REGEX_MAIL = /(?:[a-z0-9!#$%&'+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

        var data = {
            nom_utilisateur: req.sanitize(req.body.nom),
            prenom_utilisateur: req.sanitize(req.body.prenom),
            mail_utilisateur: req.sanitize(req.body.mail),
            sexe_utilisateur: req.sanitize(req.body.sexe),
            type_utilisateur: 2,
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
                res.redirect('/users/homepage');
            }
            else {
                delete data.password_utilisateur;
                res.render('inscription', { errors : errors, data: data });
            }
        })
    }
}