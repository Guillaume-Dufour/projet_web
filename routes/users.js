let express = require('express');
let router = express.Router();
let usersCtrl = require('../controllers/usersCtrl');


router.route('/inscription')
    .get(usersCtrl.inscription_get)
    .post(usersCtrl.inscription_post)

router.route('/login')
    .get(usersCtrl.login_get)
    .post(usersCtrl.login_post)

router.route('/homepage')
    .get(usersCtrl.homepage)

module.exports = router;