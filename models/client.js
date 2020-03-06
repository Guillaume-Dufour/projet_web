let connexion = require('../config/db');

class Client {

    static getProduitsFavoris(id_utilisateur, cb) {

        let requete = "SELECT p2.* FROM produit_favori p1 JOIN produit p2 ON p2.id_produit=p1.id_produit WHERE p1.id_utilisateur = ?";

        connexion.query(requete, [id_utilisateur], function (err, rows) {
            if (err) {
                throw err;
            }
            else {
                cb(rows);
            }

        })

    }

    static addProduitFavori(id_utilisateur, id_produit) {

        let requete = "INSERT IGNORE INTO produit_favori(id_utilisateur, id_produit) VALUES (?,?)";

        connexion.query(requete, [id_utilisateur, id_produit]);
    }

    static deleteProduitFavori(id_utilisateur, id_produit) {

        let requete = "DELETE FROM produit_favori WHERE id_utilisateur = ? AND id_produit = ?";

        connexion.query(requete, [id_utilisateur, id_produit], function (err) {
            if (err) {
                console.log(err)
                throw err;
            }
        })
    }

    static all(cb) {

        let requete = "SELECT * FROM utilisateur WHERE type_utilisateur = 3 AND est_actif = 1";

        connexion.query(requete, [], function (err, rows) {
            if (err) {
                throw err;
            }
            else {
                cb(rows);
            }

        })
    }

}

module.exports = Client;