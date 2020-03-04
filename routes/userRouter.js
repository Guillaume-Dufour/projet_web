let express = require('express');
let router = express.Router();
let usersCtrl = require('../controllers/userCtrl');
let userMdlw = require('../middlewares/usersMdlw');

router.use(userMdlw.is_connected_for_navbar)

router.route('/inscription')
    .get(userMdlw.is_connected, usersCtrl.inscription_get)
    .post(usersCtrl.inscription_post)

router.route('/login')
    .get(userMdlw.is_connected, usersCtrl.login_get)
    .post(usersCtrl.login_post)

router.route('/homepage')
    .get(usersCtrl.homepage)

router.route('/profil')
    .get(usersCtrl.profil)
    .put(usersCtrl.delete_profil)

router.route('/deconnect')
    .get(usersCtrl.deconnect)

module.exports = router;