let express = require('express');
let router = express.Router();
let adminCtrl = require('../controllers/adminCtrl');
let produitCtrl = require('../controllers/produitCtrl');
let usersMdlw = require('../middlewares/usersMdlw');

router.use(usersMdlw.is_connected)
router.use(usersMdlw.is_admin)

router.route('/homepage')
    .get(adminCtrl.homepage)

router.route('/profil')
    .get(adminCtrl.profil)

router.route('/produit_create')
    .get(produitCtrl.produit_create_get)
    .post(produitCtrl.produit_create_post)

router.route('/list_users')
    .get(adminCtrl.list_users)
    .put(adminCtrl.delete_infos_user)

router.route('/vendeur_create')
    .get(adminCtrl.create_vendeur_get)
    .post(adminCtrl.create_vendeur_post)

module.exports = router;