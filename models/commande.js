let connexion = require('../config/db');

class Commande {

    static create(data, cb) {

        let requete1 = "INSERT INTO commande SET ?";
        let requete2 = "INSERT INTO contenu_commande SELECT id_produit, ?, quantite FROM panier WHERE id_utilisateur = ? "

        connexion.query("INSERT INTO commande SET ?", data, function (err, result) {
            if (err) {
                throw err;
            }
            else {
                connexion.query(requete2, [result.insertId, data.id_utilisateur]);
                cb();
            }
        })
    }

    static all(cb) {

        let requete = "SELECT "
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

    static getCommandeById(id, cb) {

        let requete = "SELECT p.libelle_produit, c2.quantite_produit, p.photo_produit, p.prix_produit, p.type_vente_produit " +
            "FROM commande c1 " +
            "JOIN contenu_commande c2 ON c2.id_commande=c1.id_commande " +
            "JOIN produit p ON p.id_produit=c2.id_produit " +
            "JOIN statut_commande s ON s.id_statut_commande=c1.id_statut_commande " +
            "WHERE c1.id_commande = ?";

        connexion.query(requete, [id], function (err, rows) {
            if (err) {
                throw err;
            }
            else {
                cb(rows);
            }
        })

    }



    static exist(id_commande, cb) {

        let requete = "SELECT count(*) as nb FROM commande WHERE id_commande = ?";

        connexion.query(requete, [id_commande], function (err, row) {
            if (err) {
                throw err;
            }
            else {
                console.log(row[0]);
                cb(row[0].nb);
            }
        })
    }

    static addContenuCommande(data) {

        let requete = "INSERT INTO contenu_commande SET = ?";

        connexion.query(requete, data);
    }

}

module.exports = Commande;