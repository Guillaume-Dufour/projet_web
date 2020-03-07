let connexion = require('../config/db');

class Produit {

    static create(data) {
        connexion.query("INSERT INTO produit SET ?", data, function (err, result) {
            if (err) {
                throw err;
            }
        })
    }

    static all(cb) {

        let requete = "SELECT * FROM produit p JOIN type_produit t ON t.id_type_produit=p.id_type_produit ORDER BY p.libelle_produit";

        connexion.query(requete, [],  function (err, rows) {
            if (err) {
                throw err;
            }
            else {
                cb(rows);
            }

        })
    }

    static getAllProduitsDispoByType(id_type_produit, cb) {

        let requete = "SELECT * FROM produit WHERE id_type_produit = ? AND est_dispo = 1";

        connexion.query(requete, [id_type_produit], function (err, rows) {
            if (err) {
                throw err;
            }
            else {
                cb(rows);
            }

        })
    }

    static getAllTypesProduits(cb) {

        let requete = "SELECT * FROM type_produit ORDER BY libelle_type_produit, libelle_sous_type_produit";

        connexion.query(requete, [], function (err, rows) {
            if (err) {
                throw err;
            }
            else {
                cb(rows);
            }
        })
    }

    static getAllProduitsDispo(cb) {

        let requete = "SELECT * FROM produit p JOIN type_produit t ON t.id_type_produit=p.id_type_produit WHERE p.est_dispo=1 ORDER BY p.libelle_produit";

        connexion.query(requete, [],  function (err, rows) {
            if (err) {
                throw err;
            }
            else {
                cb(rows);
            }

        })
    }

    static getProduitById(id_produit, cb) {

        let requete = "SELECT * FROM produit p JOIN type_produit t ON t.id_type_produit=p.id_type_produit WHERE p.id_produit = ?";

        connexion.query(requete, [id_produit], function (err, row) {
            if (err) {
                throw err;
            }
            else {
                cb(row[0]);
            }
        });
    }

    static updateDispo(id_produit, value) {

        let requete = "UPDATE produit SET est_dispo = ? WHERE id_produit = ?";

        connexion.query(requete, [value, id_produit]);
    }

    static update(id_produit, data) {

        let requete = "UPDATE produit " +
            "SET libelle_produit = ?, " +
            "id_type_produit = ?, " +
            "prix_produit = ?, " +
            "poids_produit = ?, " +
            "provenance_produit = ?, " +
            "est_bio = ?, " +
            "gencod_produit = ? " +
            "WHERE id_produit = ?";

        connexion.query(requete, [data.libelle_produit, data.id_type_produit, data.prix_produit, data.poids_produit, data.provenance_produit, data.est_bio, data.gencod_produit, id_produit], function (err) {
            if (err) {
                throw err;
            }
        })
    }
}

module.exports = Produit;