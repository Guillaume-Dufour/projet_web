let connexion = require('../config/db');

class Produit {

    static create(data) {
        connexion.query("INSERT INTO produit SET ?", data, function (err, result) {
            if (err) {
                throw err;
            }
        })
    }

    static getIdTypeProduit(libelle, sous_libelle) {

    }

    static getAllProduits(cb) {

        let requete = "SELECT * FROM produit p JOIN type_produit t ON t.id_type_produit=p.id_type_produit ORDER BY p.libelle_produit";

        connexion.query(requete, [],  function (err, rows) {
            if (err) {
                throw err;
            }
            else {
                cb(rows)
            }

        })
    }

    static getProduitById(id_produit, cb) {

        let requete = "SELECT * FROM produit p JOIN type_produit t ON t.id_type_produit=p.id_type_produit WHERE p.id_produit = ?";

        connexion.query(requete, [id_produit], function (err, rows) {
            if (err) {
                throw err;
            }
            else {
                cb(rows);
            }
        });
    }
}

module.exports = Produit;