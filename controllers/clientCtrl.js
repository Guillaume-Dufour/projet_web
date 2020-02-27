let jwt = require('jsonwebtoken');
let token = require('../models/token');
let Commande = require('../models/commande');

module.exports = {
    homepage: function (req, res) {

    },

    commandes_list: function (req, res) {
        var token_decoded = jwt.verify(token.getToken(req), token.key());
        console.log("Token décodé : "+token_decoded)

        Commande.allCommandesOfUser(token_decoded.id_utilisateur, function (rows) {
            res.render('users/client/commandes_list', {commandes : rows});
        });
    }

}