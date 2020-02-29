let Commande = require('../models/commande');
let Utilisateur = require('../models/utilisateur');

module.exports = {
    homepage: function (req, res) {
        res.render('users/vendeur/homepage');
    },

    commandes_list: function (req, res) {

    }
}