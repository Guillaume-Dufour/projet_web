let Commande = require('../models/commande');
let Utilisateur = require('../models/utilisateur');
let Client = require('../models/client');
let Produit = require('../models/produit');
let fs = require('fs');
let moment = require('moment-fr');

module.exports = {
    homepage: function (req, res) {
        res.render('users/vendeur/homepage');
    },

    commandes_list: function (req, res) {

    },

    clients_list: function (req, res) {
        Client.all(function (rows) {

            for (var i = 0; i < rows.length; i++) {
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

            res.render('users/vendeur/clients_list', {clients: rows});
        })
    },

    produit_create_get: function (req, res) {
        Produit.getAllTypesProduits(function (rows) {
            res.render('users/vendeur/produit_create', {types: rows, data: undefined});
        })
    },

    produit_create_post: function (req, res) {

        var errors = [];

        var data = {
            libelle_produit: req.sanitize(req.body.libelle_produit),
            id_type_produit: req.sanitize(req.body.id_type_produit),
            prix_produit: req.sanitize(req.body.prix_produit),
            poids_produit: req.sanitize(req.body.poids_produit),
            provenance_produit: req.sanitize(req.body.provenance_produit),
            est_bio: (req.sanitize(req.body.est_bio) === undefined ? 0 : 1),
            est_dispo: 0,
            gencod_produit: req.sanitize(req.body.gencod_produit)
        }

        if (data.libelle_produit.length > 100) {
            errors.push("Le nom du produit est trop long");
            delete data.libelle_produit;
        }

        if (data.id_type_produit === undefined) {
            errors.push("Aucun type de produit saisi")
        }

        if (data.prix_produit < 0) {
            errors.push("Le prix n'est pas valide");
            delete data.prix_produit;
        }

        if (data.poids_produit < 0) {
            errors.push("Le poids n'est pas valide");
            delete data.poids_produit;
        }

        if (data.gencod_produit.length > 20) {
            errors.push("Le GENCOD est trop long");
            delete data.gencod_produit;
        }

        if (req.files.photo_produit === undefined) {
            errors.push("Aucune photo choisie");
        }

        console.log(errors);

        if (errors.length > 0) {
            Produit.getAllTypesProduits(function (rows) {
                res.render('users/vendeur/produit_create', {data: data, types: rows});
            })
        }
        else {
            fs.stat('public/images/produits/'+data.gencod_produit+'.jpg', function (err) {
                if (!err) {
                    let alphabet = "azertyuiopqsdfghjklmwxcvbn";
                    var chaine = "";

                    for (var i = 0; i < 3; i++) {
                        chaine += alphabet[Math.round(Math.random()*(alphabet.length-1))];
                    }
                    let fichier = req.files.photo_produit;
                    fichier.mv('public/images/produits/'+data.gencod_produit+chaine+'.jpg', function (err) {
                        if (err) throw err;
                    });

                    data.photo_produit = data.gencod_produit+chaine+'.jpg';
                }
                else {
                    let fichier = req.files.photo_produit;
                    fichier.mv('public/images/produits/'+data.gencod_produit+'.jpg', function (err) {
                        if (err) throw err;
                    });
                    data.photo_produit = data.gencod_produit+'.jpg';
                }

                console.log(data)
                Produit.create(data);
                res.redirect('/users/homepage');
            })
        }
    },

    produit_update_get: function (req, res) {

    },

    produit_update_put: function (req, res) {

    },

    commande_search_get: function (req, res) {
        res.render('users/vendeur/commande_search');
    },

    commande_search_post: function (req, res) {
        let date_selectionnee = req.body.date_retrait_commande;
        Commande.getCommandeOfDay(date_selectionnee, function (rows) {

            for (var i = 0; i < rows.length; i++) {
                if (rows[i].sexe_utilisateur === 1) {
                    rows[i].titre = "M.";
                } else {
                    rows[i].titre = "Mme";
                }

                let date_temp = moment(rows[i].date_retrait_commande);
                date_temp = date_temp.format('LLLL');
                rows[i].date_retrait_commande = date_temp;
            }

            res.render('users/vendeur/commande_list_day', {commandes: rows});
        })
    },

    commande_put: function (req, res) {

    }
}