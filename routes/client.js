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

router.route('/panier')
    .get(clientCtrl.panier);

router.route('/add_panier')
    .post(clientCtrl.add_panier)

router.route('/produits_favoris')
    .get(clientCtrl.produits_favoris)

module.exports = router;