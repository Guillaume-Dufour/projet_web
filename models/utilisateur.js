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

    static exist(mail) {
        connexion.query("SELECT 1 FROM utilisateur WHERE mail_utilisateur = ?", [mail], function (err, result) {
            if (err)
                throw err;

            console.log("result = "+result);

            return result ? 1 : 0;
        });
    }

}

module.exports = Utilisateur;