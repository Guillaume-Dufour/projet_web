var express = require('express');
var bodyParser = require('body-parser');
var userRouter = require('./routes/userRouter');
var clientRouter = require('./routes/clientRouter');
let produitRouter = require('./routes/produitRouter')
let vendeurRouter = require('./routes/vendeurRouter');
let adminRouter = require('./routes/adminRouter');
let userMdlw = require('./middlewares/usersMdlw');
let expressSanitizer = require('express-sanitizer');
let cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var cookie_perso = require('./models/token');
var util = require('./models/utilisateur');
let Panier = require('./models/panier');
let methodOverride = require('method-override');
let fileUpload = require('express-fileupload');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
var multer = require("multer");
var multerGoogleStorage = require('multer-google-storage');

var app = express();

var uploadHandler = multer({
    storage: multerGoogleStorage.storageEngine({
        keyFilename: "./gleaming-realm-270117-50b858c69f0e.json",
        projectId: 'gleaming-realm-270117',
        bucket: 'projet_web_charcuterie_dufour_guillaume'
    })
});

app.get('/upload', function (req, res) {
    res.render('testform')
})

app.post('/upload', uploadHandler.any(), function (req, res) {
    console.log(req.files);
    res.json(req.files);
});




const gc = new Storage({
    keyFilename: path.join(__dirname, './gleaming-realm-270117-50b858c69f0e.json'),
    projectId: 'gleaming-realm-270117'
});

const charcutBucket = gc.bucket('projet_web_charcuterie_dufour_guillaume');

app.use('/public', express.static(__dirname + '/public'));
app.use(express('views'));

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(expressSanitizer());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(fileUpload());

app.set('view engine', 'ejs');

app.use('/users', userRouter);
app.use('/users/client', clientRouter);
app.use('/users/vendeur', vendeurRouter);
app.use('/users/admin', adminRouter);
app.use('/produits', produitRouter);



app.get('/', userMdlw.is_connected_for_navbar, function (req, res) {
    res.render('accueil')
})

/*app.get('*', function (req, res) {
    res.status(404);
    res.render('error')
});*/

app.listen(8080);