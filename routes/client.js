let express = require('express');
let router = express.Router();
let clientCtrl = require('../controllers/clientCtrl');
let jwt = require('jsonwebtoken');

router.use(function (req, res, next) {
    if (req.cookies['secretToken'] !== undefined) {
        //var token_decoded = jwt.verify()
        next();
    }
    else {
        res.redirect('/');
    }
})

router.route('/homepage')
    .get(function (req, res) {
        res.send("salut");
    })


router.route('/commandes')
    .get(clientCtrl.commandes_list)

router.route('/commandes/:id_commande')
    .get(clientCtrl.commande_details)

module.exports = router;