let jwt = require('jsonwebtoken');
let Token = require('../models/token');
let Commande = require('../models/commande');
let Panier = require('../models/panier');
let Client = require('../models/client');
let Utilisateur = require('../models/utilisateur');

module.exports = {
    homepage: function (req, res) {
        res.render('users/client/homepage');
    },

    profil: function (req, res) {
        let token_decoded = jwt.verify(req.cookies['secretToken'], Token.key());
        Utilisateur.getUserById(token_decoded.id_utilisateur, function (rows) {
            res.render('users/client/profil', {infos: rows});
        })
    },

    commandes_list: function (req, res) {
        var token_decoded = jwt.verify(Token.getToken(req), Token.key());
        console.log("Token décodé : "+token_decoded)

        Commande.allCommandesOfUser(token_decoded.id_utilisateur, function (rows) {
            res.render('users/client/commandes_list', {commandes : rows});
        });
    },

    commande_details: function (req, res) {
        Commande.getCommandeById(req.params.id_commande, function (rows) {

            for (let i = 0; i < rows.length; i++) {
                rows[i].prix = rows[i].quantite_produit*rows[i].prix_produit;
            }

            res.render('users/client/commande_details', {commande : rows});
        })
    },

    panier: function (req, res) {
        var token_decoded = jwt.verify(req.cookies['secretToken'], Token.key());
        Panier.getProduits(token_decoded.id_utilisateur, function (rows) {
            res.render('users/client/panier', {panier: rows});
        });

    },

    add_panier: function (req, res) {
        var token_decoded = jwt.verify(req.cookies['secretToken'], Token.key());

        if (req.body.quantite < 0) {
            console.log(req.params)
            res.redirect('/');
        }
        else {
            Panier.addProduit(token_decoded.id_utilisateur,req.body.id_produit,req.body.quantite);
            res.redirect('/produits/liste');
        }

    },

    delete_panier: async function (req, res) {
        let token_decoded = jwt.verify(req.cookies['secretToken'], Token.key());
        console.log(req.body.id_produit);
        await Panier.deleteProduit(token_decoded.id_utilisateur,req.body.id_produit)
        res.end();
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
        res.redirect('/produits/details/'+req.body.id_produit_favori);
    }



}