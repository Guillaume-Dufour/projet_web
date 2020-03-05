let connexion = require('../config/db');

class Avis {

    static create(data) {

        let requete = "INSERT INTO avis SET ?";

        connexion.query(requete, data, function (err) {
            if (err) {
                throw err;
            }
        })
    }

    static getAllAvisOfProduit(id_produit, cb) {

        let requete = "SELECT u.id_utilisateur, u.nom_utilisateur, u.prenom_utilisateur, a.date_avis, a.commentaire_avis, a.note FROM avis a JOIN utilisateur u ON u.id_utilisateur=a.id_utilisateur WHERE a.id_produit = ?";

        connexion.query(requete, [id_produit], function (err, rows) {
            if (err) {
                throw err;
            }
            else {
                cb(rows);
            }
        })
    }

    static exist(id_utilisateur, id_produit, cb) {

        let requete = "SELECT count(*) as nb FROM avis WHERE id_utilisateur = ? AND id_produit = ?"

        connexion.query(requete, [id_utilisateur, id_produit], function (err, result) {
            if (err) {
                throw err;
            }
            else {
                cb(result[0].nb);
            }
        })
    }

    static delete(id_utilisateur, id_produit) {

        let requete = "DELETE FROM avis WHERE id_utilisateur = ? AND id_produit = ?";

        connexion.query(requete, [id_utilisateur, id_produit], function (err) {
            if (err) {
                throw err;
            }
        })
    }
}

module.exports = Avis;