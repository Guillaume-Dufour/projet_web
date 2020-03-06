module.exports = {

    create_ok: function (req, res, next) {
        var errors = [];

        var data = {
            libelle_produit: req.sanitize(req.body.libelle_produit),
            id_type_produit: req.sanitize(req.body.id_type_produit),
            prix_produit: req.sanitize(req.body.prix_produit),
            poids_produit: req.sanitize(req.body.poids_produit),
            provenance_produit: req.sanitize(req.body.provenance_produit),
            est_bio: (req.sanitize(req.body.est_bio) === undefined ? 0 : 1),
            est_dispo: 0,
            gencod_produit: req.sanitize(req.body.gencod_produit)
        }

        if (data.libelle_produit.length > 100) {
            errors.push("Le nom du produit est trop long");
            delete data.libelle_produit;
        }

        if (data.id_type_produit === undefined) {
            errors.push("Aucun type de produit saisi")
        }

        if (data.prix_produit < 0) {
            errors.push("Le prix n'est pas valide");
            delete data.prix_produit;
        }

        if (data.poids_produit < 0) {
            errors.push("Le poids n'est pas valide");
            delete data.poids_produit;
        }

        if (data.gencod_produit.length > 20) {
            errors.push("Le GENCOD est trop long");
            delete data.gencod_produit;
        }

        if (req.files.photo_produit === undefined) {
            errors.push("Aucune photo choisie");
        }

        if (errors.length > 0) {
            Produit.getAllTypesProduits(function (rows) {
                res.render('produits/create', {types: rows, data: data});
            })
        }
        else {
            req.data = data;
            next();
        }
    }
}