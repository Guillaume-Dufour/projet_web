var connexion = require('../config/db');
let bcrypt = require('bcrypt');

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

    static getUserById(id, cb) {
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

    static all(cb) {
        connexion.query("SELECT * FROM utilisateur WHERE type_utilisateur != 1 AND est_actif = 1", function (err, rows) {
            if (err) {
                throw err;
            }
            else {
                cb(rows)
            }
        })
    }

    static canConnect(mail, password, cb) {
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

                if (result.est_actif === 0) {
                    cb(-3);
                }
                else {
                    let password_ok = bcrypt.compareSync(password, result.password_utilisateur);

                    if (password_ok) {
                        cb(1, result);
                    }
                    else {
                        cb(0);
                    }
                }


            }

        })


    }

    static deleteInfos(id_utilisateur) {

        let requete = "UPDATE utilisateur SET nom_utilisateur='Anonyme', prenom_utilisateur='', mail_utilisateur='', sexe_utilisateur=0, password_utilisateur='', telephone_utilisateur='', est_actif=0 WHERE id_utilisateur = ?";

        connexion.query(requete, [id_utilisateur]);

    }

}

module.exports = Utilisateur;