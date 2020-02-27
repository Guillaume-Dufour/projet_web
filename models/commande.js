let connexion = require('../config/db');

class Commande {

    static create(data) {
        connexion.query("INSERT INTO commande SET ?", data, function (err, result) {
            if (err) {
                throw err;
            }
        })
    }

    static allCommandesOfUser(id, cb) {

        let requete =   "SELECT * FROM commande c JOIN statut_commande s ON s.id_statut_commande=c.id_statut_commande WHERE c.id_utilisateur = ?";
        
        connexion.query(requete, [id], function (err, rows) {
            if (err) {
                throw err;
            }
            else {
                cb(rows)
            }
        });
    }

}

module.exports = Commande;