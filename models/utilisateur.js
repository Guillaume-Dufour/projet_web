var connexion = require('../config/db');
let bcrypt = require('bcrypt');
var cookie_perso = require('cookie');

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

    static getUserById(id) {
        connexion.query("SELECT * FROM utilisateur WHERE id_utilisateur = ?", [id], function (err, rows) {
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

    static connect(mail, password, cb) {
        if (mail === undefined || password === undefined) {
            // retourne 2 si le mail ou le password ne sont pas renseignés
            cb(-2);
        }

        Utilisateur.getUserByMail(mail, function (result) {
            if (result === 0) {
                // retourne -1 si l'utilisateur n'existe pas
                cb(-1);
            }
            else {
                let password_ok = bcrypt.compareSync(password, result.password_utilisateur);

                if (password_ok) {
                    cb(1, result);
                }
                else {
                    return cb(0);
                }
            }

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