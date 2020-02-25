let connexion = require('../config/db');

class Commande {

    static create(data, cb) {

    }

    static allOfUser(id) {
        connexion.query("SELECT * FROM commande c1 JOIN contenu_commande c2 ON c1.id_commande=c2.id_commande WHERE id_utilisateur = ?", [id], function (err, rows) {


        })

    }

}

module.exports = Commande;