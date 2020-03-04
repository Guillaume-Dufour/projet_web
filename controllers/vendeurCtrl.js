let Commande = require('../models/commande');
let Utilisateur = require('../models/utilisateur');
let Client = require('../models/client');
let Produit = require('../models/produit');
let fs = require('fs');
let moment = require('moment-fr');

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
    },

    commande_search_get: function (req, res) {
        res.render('users/vendeur/commande_search');
    },

    commande_search_post: function (req, res) {
        let date_selectionnee = req.body.date_retrait_commande;
        Commande.getCommandeOfDay(date_selectionnee, function (rows) {

            for (var i = 0; i < rows.length; i++) {
                if (rows[i].sexe_utilisateur === 1) {
                    rows[i].titre = "M.";
                } else {
                    rows[i].titre = "Mme";
                }

                let date_temp = moment(rows[i].date_retrait_commande);
                date_temp = date_temp.format('LLLL');
                rows[i].date_retrait_commande = date_temp;
            }

            res.render('users/vendeur/commande_list_day', {commandes: rows});
        })
    },

    commande_put: function (req, res) {

    },

    produit_manage_get: function(req, res) {
        Produit.all(function (rows) {

            for (let i = 0; i < rows.length; i++) {
                rows[i].type = rows[i].libelle_type_produit+(rows[i].libelle_sous_type_produit !== null ? " - "+rows[i].libelle_sous_type_produit : "");
            }

            res.render('users/vendeur/produit_manage', {produits: rows})

        })
    },

    produit_manage_put: function(req, res) {

    }

}