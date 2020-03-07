var express = require('express');
var bodyParser = require('body-parser');
var userRouter = require('./routes/userRouter');
var clientRouter = require('./routes/clientRouter');
let produitRouter = require('./routes/produitRouter')
let vendeurRouter = require('./routes/vendeurRouter');
let adminRouter = require('./routes/adminRouter');
let userMdlw = require('./middlewares/usersMdlw');
let produitMdlw = require('./middlewares/produitMdlw');
let expressSanitizer = require('express-sanitizer');
let cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var cookie_perso = require('./models/token');
var util = require('./models/utilisateur');
let Panier = require('./models/panier');
let methodOverride = require('method-override');
let fileUpload = require('express-fileupload');
const { Storage } = require('@google-cloud/storage');
let multer = require('multer');
let multerGoogleStorage = require('multer-google-storage');

let uploadHandler = multer({
    limits: { fileSize: 1024*1024 },
    storage: multerGoogleStorage.storageEngine({
        keyFilename: "gleaming-realm-270117-50b858c69f0e.json",
        projectId: 'gleaming-realm-270117',
        bucket: 'projet_web_charcuterie_dufour_guillaume',
    })
});

var app = express();

app.get('/upload', function (req, res) {
    res.render('testform');
})

app.post('/upload', uploadHandler.any(), function (req, res) {
    console.log(req.body)
    console.log(req.files);
    res.json(req.files);
})

app.use('/public', express.static(__dirname + '/public'));
app.use(express('views'));

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(expressSanitizer());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(fileUpload());

app.set('view engine', 'ejs');


app.use(produitMdlw.liste_type_produit_nav_bar);

app.use('/users', userRouter);
app.use('/users/client', clientRouter);
app.use('/users/vendeur', vendeurRouter);
app.use('/users/admin', adminRouter);
app.use('/produits', produitRouter);

app.get('/', userMdlw.is_connected_for_navbar, userMdlw.type_user, function (req, res) {
    res.render('accueil')
})

app.get('*', userMdlw.is_connected_for_navbar, userMdlw.type_user, function (req, res) {
    res.status(404);
    res.render('error');
})

let port = process.env.PORT;
if (port === null) {
    port=8080;
}
app.listen(port);