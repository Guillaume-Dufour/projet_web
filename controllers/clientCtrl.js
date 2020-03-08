let jwt = require('jsonwebtoken');
let Token = require('../models/token');
let Commande = require('../models/commande');
let Panier = require('../models/panier');
let Client = require('../models/client');
let Utilisateur = require('../models/utilisateur');
let moment = require('moment-fr');

module.exports = {
    homepage: function (req, res) {
        res.render('users/client/homepage');
    },

    profil: function (req, res) {

        let token_decoded = jwt.verify(req.cookies['secretToken'], Token.key());
        Utilisateur.getUserById(token_decoded.id_utilisateur, function (row) {
            res.render('users/profil', {user: row});
        })

    },

    profil_modify_get: function (req, res) {
        let token_decoded = jwt.verify(req.cookies['secretToken'], Token.key());
        Utilisateur.getUserById(token_decoded.id_utilisateur, function (row) {
            res.render('users/profil_modify', {user: row});
        })
    },

    commandes_list: function (req, res) {
        var token_decoded = jwt.verify(Token.getToken(req), Token.key());

        Commande.allCommandesOfUser(token_decoded.id_utilisateur, function (rows) {

            for (let i = 0; i < rows.length; i++) {
                let date_temp = moment(rows[i].date_retrait_commande);
                date_temp = date_temp.format('LLLL');
                rows[i].date_retrait_commande = date_temp;

                date_temp=moment(rows[i].date_commande);
                date_temp = date_temp.format('LLLL');
                rows[i].date_commande = date_temp;
            }

            res.status(200);
            res.render('users/client/commandes_list', {commandes : rows});
        });
    },

    commande_details: function (req, res) {
        Commande.getCommandeById(req.params.id_commande, function (rows) {

            for (let i = 0; i < rows.length; i++) {
                rows[i].prix = rows[i].quantite_produit*rows[i].prix_produit*rows[i].poids_produit;
            }

            res.status(200);
            res.render('users/client/commande_details', {commande : rows});
        })
    },

    panier: function (req, res) {
        var token_decoded = jwt.verify(req.cookies['secretToken'], Token.key());
        Panier.getProduits(token_decoded.id_utilisateur, function (rows) {
            Panier.getPrix(token_decoded.id_utilisateur, function (prix) {
                res.render('users/client/panier', {panier: rows, prix_total: prix});
            })
        });

    },

    add_panier: function (req, res) {
        var token_decoded = jwt.verify(req.cookies['secretToken'], Token.key());

        if (req.body.quantite < 0) {
            res.redirect('/');
        }
        else {
            Panier.addProduit(token_decoded.id_utilisateur,req.body.id_produit,req.body.quantite);
            res.status(201);
            res.redirect('/produits/liste');
        }

    },

    delete_panier: async function (req, res) {
        let token_decoded = jwt.verify(req.cookies['secretToken'], Token.key());
        await Panier.deleteProduit(token_decoded.id_utilisateur,req.body.id_produit)
        Panier.getPrix(token_decoded.id_utilisateur, function (prix_total) {
            res.write(""+prix_total)
            res.status(200);
            res.end();
        })
    },

    produits_favoris: function (req, res) {
        var token_decoded = jwt.verify(req.cookies['secretToken'], Token.key());
        Client.getProduitsFavoris(token_decoded.id_utilisateur, function (rows) {
            res.render('users/client/produits_favoris', {produits: rows});
        })

    },

    add_produit_favori: function (req, res) {
        var token_decoded = jwt.verify(req.cookies['secretToken'], Token.key());
        Client.addProduitFavori(token_decoded.id_utilisateur,req.body.id_produit_favori);
        res.status(201);
        res.redirect('/produits/details/'+req.body.id_produit_favori);
    },

    valid_commande: async function (req, res) {
        let token_decoded = jwt.verify(req.cookies['secretToken'], Token.key());

        let d = new Date();
        let day = d.getDate();
        let month = d.getMonth()+1;
        let year = d.getFullYear();
        let hour = d.getHours();
        let minutes = d.getMinutes();
        let secondes = d.getSeconds();
        let full_date = year+"-"+(month < 10 ? "0"+month : month)+'-'+(day < 10 ? "0"+day : day)+' '+(hour < 10 ? "0"+hour : hour)+':'+(minutes < 10 ? "0"+minutes : minutes)+':'+(secondes < 10 ? "0"+secondes : secondes);

        let data = {
            date_commande: full_date,
            date_retrait_commande: req.body.date_retrait_commande+" "+req.body.heure_retrait_commande,
            id_statut_commande: 1,
            id_utilisateur: token_decoded.id_utilisateur
        }

        Commande.create(data, function () {
            Panier.empty(data.id_utilisateur);
        });

        res.status(201);
        res.redirect('/users/homepage');
    },

    delete_produit_favori: function (req, res) {
        let token_decoded = jwt.verify(req.cookies['secretToken'], Token.key());
        Client.deleteProduitFavori(token_decoded.id_utilisateur,req.body.id_produit)
        res.status(200);
        res.end();
    }
}