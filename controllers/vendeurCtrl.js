let Commande = require('../models/commande');
let Utilisateur = require('../models/utilisateur');
let Client = require('../models/client');
let Produit = require('../models/produit');
let Token = require('../models/token');
let jwt = require('jsonwebtoken')
let moment = require('moment-fr');

module.exports = {
    homepage: function (req, res) {
        res.render('users/vendeur/homepage');
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

    commande_details: function (req, res) {
        Commande.getCommandeById(req.params.id_commande, function (rows) {

            for (let i = 0; i < rows.length; i++) {
                rows[i].prix = rows[i].quantite_produit*rows[i].prix_produit*rows[i].poids_produit;
            }

            res.render('users/vendeur/commande_details', {commande : rows});
        })
    },

    commandes_list: function (req, res) {
        Commande.allCommandesOfUser(req.params.id, function (rows) {

            for (let i = 0; i < rows.length; i++) {
                let date_temp = moment(rows[i].date_retrait_commande);
                date_temp = date_temp.format('LLLL');
                rows[i].date_retrait_commande = date_temp;

                date_temp=moment(rows[i].date_commande);
                date_temp = date_temp.format('LLLL');
                rows[i].date_commande = date_temp;
            }

            res.render('users/vendeur/commandes_list', {commandes: rows});
        })
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

            Commande.getAllStatutsCommande(function (results) {
                res.status(200);
                res.render('users/vendeur/commande_list_day', {commandes: rows, statuts_commande: results});
            })
        })
    },

    commande_put: function (req, res) {
        Commande.updateStatutCommande(req.body.id_commande, req.body.id_statut_commande);
        res.status(200);
        res.end();
    },

    produit_manage_get: function(req, res) {
        Produit.all(function (rows) {

            for (let i = 0; i < rows.length; i++) {
                rows[i].type = rows[i].libelle_type_produit+(rows[i].libelle_sous_type_produit !== null ? " - "+rows[i].libelle_sous_type_produit : "");
            }

            res.render('users/vendeur/produit_manage', {produits: rows})
        })
    },

    stats: function (req, res) {
        Commande.getStats(6, function (rows) {

            labels = [];
            data = [];

            for (let i = 0; i < rows.length; i++) {
                labels.push(rows[i].libelle_produit);
                data.push(rows[i].nb);
            }

            res.status(200);
            res.render('users/vendeur/stats', {libelles: labels, donnees: data});
        })
    }
}