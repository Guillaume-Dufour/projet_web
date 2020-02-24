var mysql = require('mysql');

var conn = mysql.createConnection({
    database: 'projet_web',
    host: 'localhost',
    user: 'root',
    password: ''
});

conn.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log("Connecté");
    var adr = "1";
    var sql1 = "SELECT * FROM type_produit WHERE id_type_produit = "+mysql.escape(adr);

    conn.query(sql1, function (err, results) {
        if (err) {
            throw err;
        }
        console.log(results);
    })
});