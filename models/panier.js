let connexion = require('../config/db');

class Panier {

    static addProduit(id_utilisateur, id_produit, quantite) {

        let requete = "INSERT INTO panier(id_utilisateur, id_produit, quantite) VALUES (?,?,?)";

        connexion.query(requete, [id_utilisateur, id_produit, quantite]);
    }

    static deleteProduit(id_utilisateur, id_produit) {

        let requete = "DELETE FROM panier WHERE id_utilisateur = ? AND id_produit = ?";

        connexion.query(requete, [id_utilisateur, id_produit]);
    }

    static getProduits(id_utilisateur, cb) {

        let requete = "SELECT p.photo_produit, p.libelle_produit, p.prix_produit, p.poids_produit, pa.quantite FROM panier pa JOIN produit p ON p.id_produit=pa.id_produit WHERE pa.id_utilisateur = ?";

        connexion.query(requete, [id_utilisateur], function (err, rows) {
            if (err) {
                throw err;
            }
            else {
                cb(rows);
            }
        })
    }
}

module.exports = Panier;