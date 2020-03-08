let Produit = require('../models/produit');

module.exports = {

    liste_type_produit_nav_bar: function (req, res, next) {

        Produit.getAllTypesProduits(function (rows) {
            for (let i = 0; i < rows.length; i++) {
                rows[i].type = rows[i].libelle_type_produit+(rows[i].libelle_sous_type_produit !== null ? " - "+rows[i].libelle_sous_type_produit : "");
            }

            res.locals.types_produit = rows;
            next();
        });
    }
}