var express = require('express');
var router = express.Router();
var Utilisateur = require('../models/utilisateur');

router.route('/inscription')
    .get(function (req, res) {
    res.render('inscription');
})

.post(async function (req,res) {
    var data = {
        nom_utilisateur: req.body.nom,
        prenom_utilisateur: req.body.prenom,
        mail_utilisateur: req.body.mail,
        sexe_utilisateur: req.body.sexe,
        type_utilisateur: 3,
        password_utilisateur: req.body.password,
        telephone_utilisateur: req.body.telephone
    };

    var exist = await Utilisateur.exist(data.mail_utilisateur);

    console.log(exist);

    if (exist == 1) {
        res.send("L'utilisateur existe déjà")
    }
    else {

        Utilisateur.create(data);
        res.send("Utilisateur créé");
    }
})

module.exports = router;