var express = require('express');
var router = express.Router();
var Utilisateur = require('../models/utilisateur');
let bcrypt = require('bcrypt');

router.route('/inscription')
    .get(function (req, res) {
    res.render('inscription', {error: ""});
    })

    .post(function (req,res) {
        var data = {
            nom_utilisateur: req.body.nom,
            prenom_utilisateur: req.body.prenom,
            mail_utilisateur: req.body.mail,
            sexe_utilisateur: req.body.sexe,
            type_utilisateur: 3,
            password_utilisateur: bcrypt.hashSync(req.body.password,10),
            telephone_utilisateur: req.body.telephone
        };



        Utilisateur.exist(data.mail_utilisateur, function (result) {
            if (result == 1) {
                let error = "Mail déjà existant"
                res.render('inscription', { error : "Mail déjà existant"});
            }
            else {
                Utilisateur.create(data);
                res.redirect('/users/inscription');
            }
        });
    });

router.route('/login')
    .get(function (req, res) {
        res.render('login')
    })
    .post(function (req, res) {
        Utilisateur.getUserByMail(req.body.mail, function (result) {
            console.log(result);
            if (result == 0) {
                res.redirect('/users/login');
            }
            else {
                bcrypt.compare(req.body.password, result.password_utilisateur, function (err, success) {
                    if (err)
                        throw err;

                    if (success) {
                        res.send("Authentification réussi");
                    }
                    else {
                        res.send('NOOON');
                    }
                })
            }
        })


    })

module.exports = router;