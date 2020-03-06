let Produit = require('../models/produit');
let Commande = require('../models/commande');
let Avis = require('../models/avis');
let Token = require('../models/token');
let jwt = require('jsonwebtoken');
let fs = require('fs');
let multer = require('multer');
let multerGoogleStorage = require('multer-google-storage');
//var uploadHandler = require('../config/uploadCloud').array('photo_produit', 1);

var uploadHandler = multer({
    storage: multerGoogleStorage.storageEngine({
        keyFilename: "./keys.json",
        projectId: 'gleaming-realm-270117',
        bucket: 'projet_web_charcuterie_dufour_guillaume',
    })
}).array('photo_produit',1);


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
        res.redirect('/produits/details/'+req.body.id_produit_avis);
    },

    avis_delete: function (req, res) {
        let token_decoded = jwt.verify(req.cookies['secretToken'], Token.key())
        Avis.delete(token_decoded.id_utilisateur, req.body.id_produit)
        res.end();
    },

    details_post: function(req, res) {

    },

    produit_create_get: function (req, res) {

        Produit.getAllTypesProduits(function (rows) {
                res.render('produits/create', {types: rows, data: undefined});
        })
    },

    produit_create_post: function (req, res) {
        console.log(req.body)
        uploadHandler(req, res, function (err) {
          if (err) {
              throw err;
          }
          else {
              console.log(req.body);
              console.log(req.files)
          }

          res.end();

      })
    },

    /*produit_create_post: function (req, res) {



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

        if (errors.length > 0) {
            Produit.getAllTypesProduits(function (rows) {
                res.render('produits/create', {types: rows, data: data});
            })
        }
        else {
            var uploadHandler = multer({
                storage: multerGoogleStorage.storageEngine({
                    keyFilename: "../gleaming-realm-270117-50b858c69f0e.json",
                    projectId: 'gleaming-realm-270117',
                    bucket: 'projet_web_charcuterie_dufour_guillaume',
                }),
            });
            var upload = uploadHandler.any();
            console.log(upload)
            upload(req, res, function (err) {
                if (err) console.log(err);

                console.log(req.files);
            })
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

            res.end();
        }
    },*/

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