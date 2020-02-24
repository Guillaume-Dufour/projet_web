var connexion = require('../config/db');

class Utilisateur {

    static create(data) {
        /*connexion.query("INSERT INTO utilisateur (nom_utilisateur, prenom_utilisateur, mail_utilisateur, sexe_utilisateur, type_utilisateur, password_utilisateur, telephone_utilisateur) " +
            "VALUES (?)", data.map(), function (err, result) {

            if (err) {
                throw err;
            }

        })*/

        connexion.query("INSERT INTO utilisateur SET ?", data, function (err, result) {

            if (err) {
                throw err;
            }

            console.log("result1 = "+result)

        })
    }

    /*static exist(mail) {
        var promess = new Promise(function (resolve, reject) {
            connexion.query("SELECT * FROM utilisateur WHERE mail_utilisateur = ?", [mail], function (err, result) {
                if (err)
                    throw err;

                if (result[0] === undefined) {
                    resolve(result);
                }
                else {
                    resolve(result);
                }
            })

        });

        return promess;
    }*/

    function exist(mail) {
        connexion.query("SELECT * FROM utilisateur WHERE mail_utilisateur = ?", [mail], function (err, result) {
            console.log((result));
        })
    }

    static all() {
        connexion.query("SELECT * FROM utilisateur", function (err, result) {
            if (err) throw err;

            console.log(result);

        })
    }

}

module.exports = Utilisateur;