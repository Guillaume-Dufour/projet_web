var connexion = require('../config/db');

class Utilisateur {

    static create(data) {
        connexion.query("INSERT INTO utilisateur SET ?", data, function (err, result) {
            if (err) {
                throw err;
            }

        })
    }

    static exist(mail, cb) {
        connexion.query("SELECT count(*) as nb FROM utilisateur WHERE mail_utilisateur = ?", [mail], function (err, rows) {

            if (err) {
                throw err;
            } else {
                cb(rows[0].nb);
            }
        })
    }

    static getUserByMail(mail, cb) {
        connexion.query("SELECT * FROM utilisateur WHERE mail_utilisateur = ?", [mail], function (err, rows) {
            if (err) {
                throw err;
            }
            else {
                if (rows[0]) {
                    cb(rows[0]);
                }
                else {
                    cb(0);
                }
            }
        })
    }

    static all() {
        connexion.query("SELECT * FROM utilisateur", function (err, result) {
            if (err) throw err;

            console.log(result);

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

}

module.exports = Utilisateur;