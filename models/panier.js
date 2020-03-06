let connexion = require('../config/db');

class Panier {

    static addProduit(id_utilisateur, id_produit, quantite) {

        let requete = "INSERT INTO panier(id_utilisateur, id_produit, quantite) VALUES (?,?,?) " +
            "ON DUPLICATE KEY UPDATE quantite = quantite + ?";

        connexion.query(requete, [id_utilisateur, id_produit, quantite, quantite]);
    }

    static deleteProduit(id_utilisateur, id_produit) {

        let requete = "DELETE FROM panier WHERE id_utilisateur = ? AND id_produit = ?";

        connexion.query(requete, [id_utilisateur, id_produit], function (err, rows) {
            if (err) {
                throw err;
            }
            else {
                console.log(rows)
            }

        });
    }

    static getProduits(id_utilisateur, cb) {

        let requete = "SELECT p.id_produit, p.photo_produit, p.libelle_produit, p.prix_produit, p.poids_produit, pa.quantite FROM panier pa JOIN produit p ON p.id_produit=pa.id_produit WHERE pa.id_utilisateur = ?";

        connexion.query(requete, [id_utilisateur], function (err, rows) {
            if (err) {
                throw err;
            }
            else {
                cb(rows);
            }
        })
    }

    static containProduit(id_utilisateur, id_produit, cb) {

        let requete = "SELECT count(*) as nb FROM panier WHERE id_utilisateur = ? AND id_produit = ?";

        connexion.query(requete, [id_utilisateur, id_produit], function (err, result) {
            if (err) {
                throw err;
            }
            else {
                cb(result[0].nb);
            }
        })
    }

    static getPrix(id_utilisateur, cb) {

        let requete = "SELECT ROUND(ifnull(SUM(pr.prix_produit * pa.quantite * pr.poids_produit),0),2) as prix_total " +
            "FROM produit pr " +
            "JOIN panier pa ON pa.id_produit=pr.id_produit " +
            "WHERE pa.id_utilisateur = ?";

        connexion.query(requete, [id_utilisateur], function (err, result) {
            if (err) {
                throw err;
            }
            else {
                cb(result[0].prix_total)
            }
        })
    }

    static empty(id_utilsateur) {

        let requete = "DELETE FROM panier WHERE id_utilisateur = ?";
        connexion.query(requete, [id_utilsateur]);
    }
}

module.exports = Panier;