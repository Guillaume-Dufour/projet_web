let Produit = require('../models/produit');
let Commande = require('../models/commande');
let Panier =

module.exports = {
    liste: function (req, res) {
        Produit.getAllProduits(function (rows) {
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
}