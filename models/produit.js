let connexion = require('../config/db');

class Produit {

    static create(data) {
        connexion.query("INSERT INTO produit SET ?", data, function (err, result) {
            if (err) {
                throw err;
            }
        })
    }

    static getIdTypeProduit(libelle) {

    }

}

module.exports = Produit;