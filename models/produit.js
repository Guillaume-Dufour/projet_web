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

        let requete = "SELECT * FROM produit p JOIN type_produit t ON t.id_type_produit=p.id_type_produit";

        connexion.query(requete, [],  function (err, rows) {
            if (err) {
                throw err;
            }
            else {
                cb(rows)
            }

        })
    }

}

module.exports = Produit;