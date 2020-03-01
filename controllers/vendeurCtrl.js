let Commande = require('../models/commande');
let Utilisateur = require('../models/utilisateur');
let Client = require('../models/client');

module.exports = {
    homepage: function (req, res) {
        res.render('users/vendeur/homepage');
    },

    commandes_list: function (req, res) {

    },

    clients_list: function (req, res) {
        Client.all(function (rows) {

            for (var i = 0; i < rows.length; i++) {
                if (rows[i].sexe_utilisateur === 1) {
                    rows[i].titre = "M.";
                }
                else {
                    rows[i].titre = "Mme";
                }

                if (rows[i].telephone_utilisateur === null) {
                    rows[i].telephone_utilisateur="Numéro de télephone non renseigné";
                }
            }

            res.render('users/vendeur/clients_list', {clients: rows});
        })
    }
}