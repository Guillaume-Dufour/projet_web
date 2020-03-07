let jwt = require('jsonwebtoken');
let Token = require('../models/token');
let Commande = require('../models/commande');

module.exports = {

    is_connected_for_navbar: function (req, res, next) {
        if (req.cookies['secretToken'] !== undefined) {
            res.locals.estConnecte=1;
        }
        else {
            res.locals.estConnecte=0;
        }

        next();
    },

    is_connected: function(req, res, next) {
      if (req.cookies['secretToken'] !== undefined) {
          res.redirect('/users/homepage')
      }
      else {
          next();
      }
    },

    is_admin: function (req, res, next) {
        if (req.cookies['secretToken'] !== undefined) {
            let token_decoded = jwt.verify(req.cookies['secretToken'], Token.key());

            if (token_decoded.type_utilisateur === 1) {
                res.locals.type_utilisateur=1;
                next();
            }
            else {
                res.redirect('/users/homepage');
            }
        }
        else {
            res.redirect('/users/login');
        }
    },

    is_vendeur: function (req, res, next) {
        if (req.cookies['secretToken'] !== undefined) {
            let token_decoded = jwt.verify(req.cookies['secretToken'], Token.key());

            if (token_decoded.type_utilisateur === 2) {
                res.locals.type_utilisateur=2;
                next();
            }
            else {
                res.redirect('/users/homepage');
            }
        }
        else {
            res.redirect('/users/login');
        }
    },

    is_client: function (req, res, next) {
        if (req.cookies['secretToken'] !== undefined) {
            let token_decoded = jwt.verify(req.cookies['secretToken'], Token.key());

            if (token_decoded.type_utilisateur === 3) {
                res.locals.type_utilisateur=3;
                next();
            }
            else {
                res.redirect('/users/homepage');
            }
        }
        else {
            res.redirect('/users/login');
        }
    },

    type_user: function (req, res, next) {
        if (req.cookies['secretToken'] !== undefined) {
            let token_decoded = jwt.verify(req.cookies['secretToken'], Token.key());
            res.locals.type_utilisateur = token_decoded.type_utilisateur;
        }

        next();
    },

    verif_commande_user: function (req, res, next) {
        Commande.getCommandeById(req.params.id_commande, function (commande) {
            let token_decoded = jwt.verify(req.cookies['secretToken'], Token.key());
            if (commande[0].id_utilisateur === token_decoded.id_utilisateur) {
                next();
            }
            else {
                res.redirect('/users/homepage');
            }
        });
    }
}