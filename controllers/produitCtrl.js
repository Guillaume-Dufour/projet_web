let Produit = require('../models/produit');

module.exports = {
    liste: function (req, res) {
        Produit.getAllProduits(function (rows) {
            console.log(rows)
            res.render('produits/liste', {produits: rows});
        })
    }
}