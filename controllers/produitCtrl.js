let Produit = require('../models/produit');
let Avis = require('../models/avis');
let Token = require('../models/token');
let jwt = require('jsonwebtoken');

module.exports = {
    liste: function (req, res) {
        Produit.getAllProduitsDispo(function (rows) {
            res.render('produits/liste', {produits: rows});
        })
    },

    details: function (req, res) {
        Produit.getProduitById(req.params.id_produit, function (rows) {
            Avis.getAllAvisOfProduit(req.params.id_produit, function (result) {
                if (req.cookies['secretToken'] !== undefined) {
                    let token_decoded = jwt.verify(req.cookies['secretToken'], Token.key());
                    Avis.exist(token_decoded.id_utilisateur, req.params.id_produit, function (resultat) {
                        res.locals.exist = resultat;
                        res.locals.id_utilisateur = token_decoded.id_utilisateur;
                        res.render('produits/details', {produit: rows, avis: result});
                    })
                }
                else {
                    res.render('produits/details', {produit: rows, avis: result});
                }
            })
        })
    },

    liste_type: function(req, res) {
        Produit.getAllProduitsDispoByType(req.params.id_type_produit, function (rows) {
            res.render('produits/liste', {produits: rows});
        })
    },

    avis_post: function (req, res) {

        let d = new Date();
        let day = d.getDate();
        let month = d.getMonth()+1;
        let year = d.getFullYear();
        let hour = d.getHours();
        let minutes = d.getMinutes();
        let secondes = d.getSeconds();
        let full_date = year+"-"+(month < 10 ? "0"+month : month)+'-'+(day < 10 ? "0"+day : day)+' '+(hour < 10 ? "0"+hour : hour)+':'+(minutes < 10 ? "0"+minutes : minutes)+':'+(secondes < 10 ? "0"+secondes : secondes);

        let token_decoded = jwt.verify(req.cookies['secretToken'], Token.key());

        let data = {
            id_utilisateur: token_decoded.id_utilisateur,
            id_produit: req.body.id_produit_avis,
            date_avis: full_date,
            commentaire_avis: req.body.avis,
            note: req.body.note
        }

        Avis.create(data);
        res.status(201);
        res.redirect('/produits/details/'+req.body.id_produit_avis);
    },

    avis_delete: function (req, res) {
        Avis.delete(req.body.id_utilisateur, req.body.id_produit)
        res.status(200);
        res.end();
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


        if (errors.length > 0) {
            Produit.getAllTypesProduits(function (rows) {
                res.render('produits/create', {types: rows, data: data});
            })
        }
        else {
            Produit.create(data);
            res.redirect('/users/homepage');
        }
    },



    produit_update_dispo: function(req, res) {

        let est_dispo = (req.body.value === '1' ? '0' : '1');
        Produit.updateDispo(req.body.id_produit, est_dispo);
        res.status(200);
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
            res.status(200);
            res.redirect('/users/vendeur/produit_manage');
        }
    }
}