var mysql = require('mysql');

/*var connexion = mysql.createConnection({
    database: 'projet_web',
    host: 'localhost',
    user: 'root',
    password: ''
});*/

var connexion = mysql.createPool({
    database: 'heroku_e8bbb531c7959a6',
    host: 'eu-cdbr-west-02.cleardb.net',
    user: 'b8ea25e5578da9',
    password: '0f9a566c'
});

connexion.connect(function (err) {
    if (err)
        throw err;

    console.log("Connexion effectuée");
});

module.exports = connexion;