let connexion = require('../config/db');

class Commande {

    static create(data) {
        connexion.query("INSERT INTO commande SET ?", data, function (err, result) {
            if (err) {
                throw err;
            }
        })
    }

    static allOfUser(id) {

        let requete =   "SELECT * FROM commande c1 " +
                        "JOIN contenu_commande c2 ON c1.id_commande=c2.id_commande " +
                        "JOIN statuc_commande s ON s.id_statut_commande=c1.id_statut_commande"+
                        "WHERE id_utilisateur = ?"
        
        connexion.query(requete, [id], function (err, rows) {


        })

    }

}

module.exports = Commande;