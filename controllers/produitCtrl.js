let Produit = require('../models/produit');
let Commande = require('../models/commande');

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

    insert_panier: function (req, res) {
        Commande.insertProduitInPanier(req.body.id_commande, req.body.id_produit, req.body.quantite);
        res.redirect('/produits/liste');
    }
}