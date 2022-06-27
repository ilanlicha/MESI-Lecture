var express = require("express");
var bodyParser = require("body-parser");
var upload = require("express-fileupload");
var cors = require('cors');
var fs = require('fs');
var mongoose = require('mongoose');
var { exec } = require("child_process");
var readLastLines = require('read-last-lines');
const { callbackify } = require("util");

// Créer une nouvelle instance du serveur express
var app = express();

// Définir les données parsées en JSON
app.use(bodyParser.json({ extended: true }));

// Gérer le cors
app.use(cors());

// Active l'upload
app.use(upload())

// Initialise le serveur
var server = app.listen(process.env.PORT || 8081, '0.0.0.0', function () {
    var port = server.address().port;
    console.log("L'application est lancée sur le port", port);
});

// Préparer la base de données MongoDB
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/livre');

mongoose.model('livre',
    new Schema({
        name: String, auteur: String, description: String, couvertureData: Buffer
    }, {
        versionKey: false
    }),
    'livre');

const livre = mongoose.model('livre');

// GET

app.get('/api/book', (req, res) => {
    let id = req.query.id;
    let name = req.query.name;

    if (id) {
        livre.findOne({ _id: id }, function (err, obj) { res.status(200).json(obj); });
    } else if (name) {
        livre.findOne({ name: name }, function (err, obj) { res.status(200).json(obj); });
    } else {
        livre.find({}, function (err, obj) { res.status(200).json(obj); });
    }
});

app.get('/api/content', (req, res) => {
    let name = req.query.name;
    var dir = "./books/" + name + "/" + name + ".txt";

    fs.readFile(dir, (err, data) => {
        res.status(200).json({
            message: data.toString(),
            status: 200
        });
    });
});


// POST

app.post('/api/create', (req, res) => {
    var name = req.body.name;
    var auteur = req.body.auteur;
    var description = req.body.description;
    var contenu = req.body.contenu;
    var couverture = req.files.couverture;
    var couvertureData = couverture.data;

    livre.find({ name: name }, function (err, docs) {
        if (docs.length) {
            res.status(409).json({
                message: 'Livre déjà existant',
                status: 409
            });
        } else {
            try {
                livre.create({
                    name,
                    auteur,
                    description,
                    couvertureData
                });
                var dir = "./books/" + name + "/";

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                fs.writeFile(dir + name + ".txt", contenu, function (err) {
                    if (err) throw err;
                });
                res.status(201).json({
                    message: 'Livre créé',
                    status: 201
                });
            } catch (e) {
                res.status(500).json({
                    message: 'Création échouée',
                    status: 500
                });
            }
        }
    });
});