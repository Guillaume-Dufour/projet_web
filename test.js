var express = require('express');

var app = express();
app.use('/public', express.static(__dirname + '/public'));

app.get('/', function (req,res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send("Vous êtes sur l'accueil !")

});

app.get('/salut/:p1', function (req,res) {
    var p1 = req.params.p1;
    console.log(p1);
    res.setHeader('Content-Type', 'text/plain');
    res.send("Vous êtes sur l'accueil numero 2 !")

});

app.get('/:valeur/chambre', function (req, res) {
    res.send("Vous êtes à l'étage n°"+ req.params.valeur)

});

app.get('/compter/:nombre', function(req, res) {
    res.render('page.ejs', {compteur : req.params.nombre});
});


//app.listen(8080);