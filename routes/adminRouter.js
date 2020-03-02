let express = require('express');
let router = express.Router();
let adminCtrl = require('../controllers/adminCtrl');
let usersMdlw = require('../middlewares/usersMdlw');

router.use(usersMdlw.is_connected)
router.use(usersMdlw.is_admin)

router.route('/homepage')
    .get(adminCtrl.homepage)

module.exports = router;