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
        name: String, auteur: String, description: String,
        date: String, contenu: String
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

// POST

app.post('/api/create', (req, res) => {
    const { name, auteur, description, contenu } = req.body;
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
                    contenu
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