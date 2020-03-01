let express = require('express');
let router = express.Router();
let clientCtrl = require('../controllers/clientCtrl');
let usersMdlw = require('../middlewares/usersMdlw');
let jwt = require('jsonwebtoken');


router.use(usersMdlw.is_connected);
router.use(usersMdlw.is_client);


router.route('/homepage')
    .get(clientCtrl.homepage)

router.route('/profil')
    .get(clientCtrl.profil)

router.route('/commandes')
    .get(clientCtrl.commandes_list)

router.route('/commandes/:id_commande')
    .get(clientCtrl.commande_details)

router.route('/panier')
    .get(clientCtrl.panier)
    .delete(clientCtrl.delete_panier);

router.route('/add_panier')
    .post(clientCtrl.add_panier)

router.route('/add_produit_favori')
    .post(clientCtrl.add_produit_favori)

router.route('/produits_favoris')
    .get(clientCtrl.produits_favoris)

module.exports = router;