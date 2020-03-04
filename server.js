var express = require('express');
var bodyParser = require('body-parser');
var userRouter = require('./routes/userRouter');
var clientRouter = require('./routes/clientRouter');
let produitRouter = require('./routes/produitRouter')
let vendeurRouter = require('./routes/vendeurRouter');
let adminRouter = require('./routes/adminRouter');
let expressSanitizer = require('express-sanitizer');
let cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var cookie_perso = require('./models/token');
var util = require('./models/utilisateur');
let Panier = require('./models/panier');
let methodOverride = require('method-override');
let fileUpload = require('express-fileupload');

var app = express();

app.use('/public', express.static(__dirname + '/public'));
app.use(express('views'));
//app.use('/photo_produit', express.static(__dirname + '/public/images/produits'))

/*const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
const $ = jQuery = require('jquery')(window);
global.$ = $;*/

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


/*app.get('/', function (req, res) {
    let estConnecte = (req.cookies['secretToken'] ? 1 : 0);
    res.render('accueil', {estConnecte: estConnecte});
});*/

app.get('/', function (req, res) {
    res.render('accueil')
})

app.post('/', function (req, res) {
    let france = req.files.guillaume;
    france.mv('public/images/france.jpg', function (err) {
        if (err) {
            console.log(err)
        }

    })
    res.redirect('/');
})

app.get('/guillaume', function (req, res) {
    let a="";
})

app.get('*', function (req, res) {
    res.status(404);
    res.render('error')
});

app.listen(8080);