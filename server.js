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
let methodOverride = require('method-override');

var app = express();

app.use('/public', express.static(__dirname + '/public'));
app.use(express('views'));

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(expressSanitizer());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

app.use(produitMdlw.liste_type_produit_nav_bar);

app.use('/users', userRouter);
app.use('/users/client', clientRouter);
app.use('/users/vendeur', vendeurRouter);
app.use('/users/admin', adminRouter);
app.use('/produits', produitRouter);

app.get('/', userMdlw.is_connected_for_navbar, userMdlw.type_user, function (req, res) {
    res.render('accueil')
});

app.get('*', userMdlw.is_connected_for_navbar, userMdlw.type_user, function (req, res) {
    res.status(404);
    res.render('error');
});

let port = process.env.PORT || 8080;
app.listen(port);