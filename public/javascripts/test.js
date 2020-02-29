$(document).ready(function () {
    $('#bouton').click(function (req, res) {
        var t = document.getElementById("bouton").className;
        console.log(t)

        if (t === "btn btn-warning") {
            document.getElementById("bouton").className = "btn btn-danger"
        }
        else {
            document.getElementById("bouton").className = "btn btn-warning"
        }
    });
});