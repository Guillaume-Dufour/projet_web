let express = require('express');
let router = express.Router();
let vendeurCtrl = require('../controllers/vendeurCtrl');
let usersMdlw = require('../middlewares/usersMdlw');
let jwt = require('jsonwebtoken');


router.use(usersMdlw.is_connected);
router.use(usersMdlw.is_vendeur);


router.route('/homepage')
    .get(vendeurCtrl.homepage)

router.route('/infos_clients')
    .get(vendeurCtrl.clients_list)

router.route('/produit_create')
    .get(vendeurCtrl.produit_create_get)
    .post(vendeurCtrl.produit_create_post)

module.exports = router;