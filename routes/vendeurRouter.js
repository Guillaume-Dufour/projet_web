let express = require('express');
let router = express.Router();
let vendeurCtrl = require('../controllers/vendeurCtrl');
let produitCtrl = require('../controllers/produitCtrl');
let usersMdlw = require('../middlewares/usersMdlw');
let jwt = require('jsonwebtoken');


router.use(usersMdlw.is_connected);
router.use(usersMdlw.is_vendeur);

router.route('/homepage')
    .get(vendeurCtrl.homepage)

router.route('/infos_clients')
    .get(vendeurCtrl.clients_list)

router.route('/produit_create')
    .get(produitCtrl.produit_create_get)
    .post(produitCtrl.produit_create_post)

router.route('/produit_update/:id')
    .get(produitCtrl.update_get)
    .put(produitCtrl.update_put)

router.route('/produit_manage')
    .get(vendeurCtrl.produit_manage_get)

router.route('/commande_search')
    .get(vendeurCtrl.commande_search_get)
    .post(vendeurCtrl.commande_search_post)
    .put(vendeurCtrl.commande_put)

module.exports = router;