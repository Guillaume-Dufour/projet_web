let Produit = require('../models/produit');
let Commande = require('../models/commande');
let Token = require('../models/token');
let jwt = require('jsonwebtoken');
let fs = require('fs');

module.exports = {
    liste: function (req, res) {
        Produit.getAllProduitsDispo(function (rows) {

            res.render('produits/liste', {produits: rows});
        })
    },

    details: function (req, res) {
        Produit.getProduitById(req.params.id_produit, function (rows) {
            res.render('produits/details', {produit: rows});
        })
    },

    details_post: function(req, res) {

    },

    produit_create_get: function (req, res) {

        Produit.getAllTypesProduits(function (rows) {
                res.render('produits/create', {types: rows, data: undefined});
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
                res.render('produits/create', {types: rows, data: data});
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

                Produit.create(data);
                res.redirect('/users/homepage');
            })
        }
    },

    produit_update_dispo: function(req, res) {

        let est_dispo = (req.body.value === '1' ? '0' : '1');
        Produit.updateDispo(req.body.id_produit, est_dispo);
        res.end();
    },

    update_get: function (req, res) {
        Produit.getProduitById(req.params.id, function (row) {
            if (row) {
                row.type = row.libelle_type_produit+(row.libelle_sous_type_produit !== null ? " - "+row.libelle_sous_type_produit : "");
                Produit.getAllTypesProduits(function (rows) {

                    for (let i = 0; i < rows.length; i++) {
                        rows[i].type = rows[i].libelle_type_produit+(rows[i].libelle_sous_type_produit !== null ? " - "+rows[i].libelle_sous_type_produit : "");
                    }

                    res.render('produits/update', {produit: row, types: rows});
                })

            }
            else {
                res.redirect('/users/homepage');
            }
        })

    },

    update_put: function (req, res) {

        var errors = [];

        var data = {
            libelle_produit: req.sanitize(req.body.libelle_produit),
            id_type_produit: req.sanitize(req.body.id_type_produit),
            prix_produit: req.sanitize(req.body.prix_produit),
            poids_produit: req.sanitize(req.body.poids_produit),
            provenance_produit: req.sanitize(req.body.provenance_produit),
            est_bio: (req.sanitize(req.body.est_bio) === undefined ? 0 : 1),
            gencod_produit: req.sanitize(req.body.gencod_produit)
        }

        console.log(data)

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

        if (errors.length > 0) {
            Produit.getAllTypesProduits(function (rows) {
                res.redirect('/users/vendeur/produit_update/'+req.body.id_produit)
            })
        }
        else {
            Produit.update(req.body.id_produit, data);
            res.redirect('/users/vendeur/produit_manage');
        }
    }
}