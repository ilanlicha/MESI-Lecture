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

mongoose.connect('mongodb://db/applications');

var FilesSchema = new Schema({
    name: String,
    status: String
}, {
    _id: false
});

mongoose.model('application',
    new Schema({
        name: String, ins: String, description: String,
        portFront: Number, status: String, frontEnd: String,
        portBack: Number, backEnd: String,
        sourceFiles: [FilesSchema], configFiles: [FilesSchema]
    }, {
        versionKey: false
    }),
    'application');

const applications = mongoose.model('application');

// GET

/**
 * Retourne une ou toutes les applications en fonction
 * de si un id, un nom ou rien est envoyé en paramètre
 */
app.get('/api/app', (req, res) => {
    let id = req.query.id;
    let name = req.query.name;

    if (id) {
        // Retourne une application grâce à son id.
        // Si les conteneurs de l'application
        // sont arrétés, l'application est passé à "OFF".
        applications.findOne({ _id: id }, function (err, obj) {
            if (obj.status === "ON")
                exec('podman-remote container inspect -f \'{{.State.Status}}\' ' + obj.name.toLowerCase() + '_back ; podman-remote container inspect -f \'{{.State.Status}}\' ' + obj.name.toLowerCase() + '_front', (err, stdout, stderr) => {
                    if (stdout) {
                        console.log(stdout);
                        let count = stdout.split("running").length - 1;
                        if (count != 2)
                            applications.findOneAndUpdate({ _id: id }, { status: "OFF" }, function (err, obj) {
                            });
                    } else {
                        console.log(stderr);
                        console.log(err);
                        applications.findOneAndUpdate({ _id: id }, { status: "OFF" }, function (err, obj) {
                        });
                    }
                    applications.findOne({ _id: id }, function (err, obj) {
                        res.status(200).json(obj);
                    });
                });
            else
                applications.findOne({ _id: id }, function (err, obj) {
                    res.status(200).json(obj);
                });
        });
    } else if (name) {
        // Retourne une application grâce à son nom.
        applications.findOne({ name: name }, function (err, obj) { res.status(200).json(obj); });
    } else {
        // Retourne toutes les applications.
        // Si les conteneurs d'une application
        // sont arrétés, l'application est passé à "OFF".
        applications.find({}, function (err, obj) {
            obj.forEach(app => {
                if (app.status === "ON") {
                    exec('podman-remote container inspect -f \'{{.State.Status}}\' ' + app.name.toLowerCase() + '_back ; podman-remote container inspect -f \'{{.State.Status}}\' ' + app.name.toLowerCase() + '_front', (err, stdout, stderr) => {
                        if (stdout) {
                            console.log(stdout);
                            if (stdout.split("running").length - 1 !== 2)
                                applications.findOneAndUpdate({ _id: app.id }, { status: "OFF" }, function (err, obj) { });
                        } else {
                            console.log(stderr);
                            console.log(err);
                            applications.findOneAndUpdate({ _id: app.id }, { status: "OFF" }, function (err, obj) { });
                        }
                    });
                }
            });
        });
        applications.find({}, function (err, obj) { res.status(200).json(obj); });
    }
});

/**
 * Retourne le nom d'une application grâce à son id.
 */
app.get('/api/name', (req, res) => {
    let id = req.query.id;
    applications.findOne({ _id: id }, { name: 1 }, function (err, obj) {
        res.status(200).json({
            message: obj.name,
            status: 200
        });
    });
});

/**
 * Retourn les 500 dernières lignes du
 * fichier log d'une application
 */
app.get('/api/logs', (req, res) => {
    let id = req.query.id;
    var file = "../files/" + id + "/logs.log";

    if (fs.existsSync(file)) {
        readLastLines.read(file, 500)
            .then((lines) => res.status(200).json({
                message: lines,
                status: 200
            }));
    } else
        res.status(200).json({
            message: "Pas de log",
            status: 200
        });
});

// POST
/**
 * Upload le fichier reçu dans le dossier
 * files/id/source|conf.
 * ( =!addfile )
 */
app.post('/api/upload', (req, res) => {
    var file = req.files.file;
    var id = req.body.id;
    var type = req.body.type;

    if (type === 'source')
        applications.findOneAndUpdate({ _id: id, 'sourceFiles.name': file.name }, { 'sourceFiles.$.status': "yes" }, function (err, obj) {
            var dir = "../files/" + id + "/source/";

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            fs.writeFile(dir + file.name, file.data, function (err) {
                if (err) throw err;
            });
            applications.findOne({ _id: id }, { sourceFiles: 1 }, function (err, obj) {
                res.status(200).json({
                    files: obj.sourceFiles
                });
            });
        });
    else if (type === 'config')
        applications.findOneAndUpdate({ _id: id, 'configFiles.name': file.name }, { 'configFiles.$.status': "yes" }, function (err, obj) {
            var dir = "../files/" + id + "/conf/";

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            fs.writeFile(dir + file.name, file.data, function (err) {
                if (err) throw err;
            });
            applications.findOne({ _id: id }, { configFiles: 1 }, function (err, obj) {
                res.status(200).json({
                    files: obj.configFiles
                });
            });
        });
});

/**
 * Créer une application avec un nom,
 * un ins et une description.
 * Le reste des champs sont vides pour les initialiser
 * dans la bdd mongodb.
 */
app.post('/api/create', (req, res) => {
    const { name, ins, description, port, status, sourceFiles, configFiles } = req.body;
    applications.find({ name: name }, function (err, docs) {
        if (docs.length) {
            res.status(409).json({
                message: 'Application déjà existante',
                status: 409
            });
        } else {
            try {
                applications.create({
                    name,
                    ins,
                    description,
                    port,
                    status,
                    frontEnd: "",
                    backEnd: "",
                    dockerCompose: "",
                    sourceFiles,
                    configFiles
                });
                res.status(201).json({
                    message: 'Application créée',
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

// PUT
/**
 * Modifie les champs d'une application
 */
app.put('/api/edit', (req, res) => {
    const { id, name, ins, description, portFront, frontEnd, portBack, backEnd } = req.body;
    applications.findOneAndUpdate({ _id: id }, { name: name, ins: ins, description: description, portFront: portFront, frontEnd: frontEnd, portBack: portBack, backEnd: backEnd }, function (err, obj) {
        res.status(200).json({
            message: 'Application modifiée',
            status: 200
        });
    });
});

/**
 * Allume une application
 */
app.put('/api/on', (req, res) => {
    let id = req.body.id
    var dir = "../files/" + id + "/tmp/";

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    var msg = "";
    // lire les fichiers sources
    fs.readdir("../files/" + id + "/source/", function (err, list) {
        // si il y a bien des fichiers
        if (list && list[0]) {
            msg += "FICHIER SOURCE : OK";
            // copier les fichiers sources dans le dossier tmp
            list.forEach(file => {
                fs.readFile("../files/" + id + "/source/" + file, (err, data) => {
                    fs.writeFile(dir + file, data, (err) => { });
                });
            });
            // lire les fichiers de configuration
            fs.readdir("../files/" + id + "/conf/", function (err, list) {
                // si il y a bien des fichiers
                if (list && list[0]) {
                    msg += "\nFICHIER CONF : OK";
                    // copier les fichiers sources dans le dossier tmp
                    list.forEach(file => {
                        fs.readFile("../files/" + id + "/conf/" + file, (err, data) => {
                            fs.writeFile(dir + file, data, (err) => { });
                        });
                    });
                    // récuperer les dockerfile et ports
                    applications.findOne({ _id: id }, { "name": 1, "frontEnd": 1, "backEnd": 1, "portFront": 1, "portBack": 1 }, function (err, obj) {
                        var error = false;
                        // vérifier les dockerfiles
                        if (obj.frontEnd === "" && obj.backEnd !== "") {
                            msg += "\nDOCKERFILE FRONT : KO";
                            msg += "\nDOCKERFILE BACK : OK";
                            error = true;
                        } else if (obj.frontEnd !== "" && obj.backEnd === "") {
                            msg += "\nDOCKERFILE FRONT : OK";
                            msg += "\nDOCKERFILE BACK : KO";
                            error = true;
                        } else if (obj.frontEnd === "" && obj.backEnd === "") {
                            msg += "\nDOCKERFILE FRONT : KO";
                            msg += "\nDOCKERFILE BACK : KO";
                            error = true;
                        } else {
                            msg += "\nDOCKERFILE FRONT : OK";
                            msg += "\nDOCKERFILE BACK : OK";
                            // vérifier les ports
                            if (isNaN(parseInt(obj.portFront)) && !isNaN(parseInt(obj.portBack))) {
                                msg += "\nPORT FRONT : KO";
                                msg += "\nPORT BACK : OK";
                                error = true;
                            } else if (!isNaN(parseInt(obj.portFront)) && isNaN(parseInt(obj.portBack))) {
                                msg += "\nPORT FRONT : OK";
                                msg += "\nPORT BACK : KO";
                                error = true;
                            } else if (isNaN(parseInt(obj.portFront)) && isNaN(parseInt(obj.portBack))) {
                                msg += "\nPORT FRONT : KO";
                                msg += "\nPORT BACK : KO";
                                error = true;
                            } else {
                                msg += "\nPORT FRONT : OK";
                                msg += "\nPORT BACK : OK";
                                // créer le fichier dockerfile front
                                fs.writeFile(dir + "front_Dockerfile", obj.frontEnd, function (err) {
                                    // lancer le conteneur front
                                    exec('podman-remote build . -f /conteneurisation/data/files/' + id + '/tmp/front_Dockerfile -t ' + obj.name.toLowerCase() + '_front && podman-remote run -p' + obj.portFront + ':' + obj.portFront + ' --name ' + obj.name.toLowerCase() + '_front -d ' + obj.name.toLowerCase() + '_front', {
                                        cwd: dir
                                    }, (err, stdout, stderr) => {
                                        // lancement réussi
                                        if (stdout) {
                                            msg += "\nFRONT : " + stdout;
                                            // créer le fichier dockerfile back
                                            fs.writeFile(dir + "back_Dockerfile", obj.backEnd, function (err) {
                                                // lancer le conteneur back
                                                exec('podman-remote build . -f /conteneurisation/data/files/' + id + '/tmp/back_Dockerfile -t ' + obj.name.toLowerCase() + '_back && podman-remote run -p' + obj.portBack + ':' + obj.portBack + ' --name ' + obj.name.toLowerCase() + '_back -d ' + obj.name.toLowerCase() + '_back', {
                                                    cwd: dir
                                                }, (err, stdout, stderr) => {
                                                    // lancement réussi
                                                    if (stdout) {
                                                        msg += "\nBACK : " + stdout;
                                                        writeLog(id, msg);
                                                        applications.findOneAndUpdate({ _id: id }, { status: "ON" }, function (err, obj) {
                                                            res.status(200).json({
                                                                message: 'ON',
                                                                status: 200
                                                            });
                                                        });
                                                    } else {
                                                        // lancement back échoué
                                                        msg += "\nBACK : " + stderr;
                                                        writeLog(id, msg);
                                                        applications.findOneAndUpdate({ _id: id }, { status: "OFF" }, function (err, obj) {
                                                            res.status(200).json({
                                                                message: 'OFF',
                                                                status: 200
                                                            });
                                                        });
                                                    }
                                                });
                                            });
                                        } else {
                                            // lancement front échoué
                                            msg += "\nFRONT : " + stderr;
                                            writeLog(id, msg);
                                            applications.findOneAndUpdate({ _id: id }, { status: "OFF" }, function (err, obj) {
                                                res.status(200).json({
                                                    message: 'OFF',
                                                    status: 200
                                                });
                                            });
                                        }
                                    });
                                });
                            }
                        }
                        // si il y a une erreur dockerfile/port
                        if (error) {
                            applications.findOneAndUpdate({ _id: id }, { status: "OFF" }, function (err, obj) {
                                res.status(200).json({
                                    message: 'OFF',
                                    status: 200
                                });
                            });
                            writeLog(id, msg);
                        }
                    });
                } else {
                    // erreur de fichiers de conf
                    msg += "\nFICHIER CONF : KO";
                    writeLog(id, msg);
                    applications.findOneAndUpdate({ _id: id }, { status: "OFF" }, function (err, obj) {
                        res.status(200).json({
                            message: 'OFF',
                            status: 200
                        });
                    });
                }
            });
        }
        else {
            // erreur de fichiers source
            msg += "\nFICHIER SOURCE : KO";
            writeLog(id, msg);
            applications.findOneAndUpdate({ _id: id }, { status: "OFF" }, function (err, obj) {
                res.status(200).json({
                    message: 'OFF',
                    status: 200
                });
            });
        }
    });
});

/**
 * Éteint une application
 */
app.put('/api/off', (req, res) => {
    let id = req.body.id
    try {
        applications.findOne({ _id: id }, { "name": 1 }, function (err, obj) {
            try {
                exec('podman-remote rm -f ' + obj.name.toLowerCase() + '_front && podman-remote rm -f ' + obj.name.toLowerCase() + '_back', (err, stdout, stderr) => {
                    if (stdout) {
                        console.log(stdout);
                        writeLog(id, stdout);
                        applications.findOneAndUpdate({ _id: id }, { status: "OFF" }, function (err, obj) {
                            res.status(200).json({
                                message: 'OFF',
                                status: 200
                            });
                        });
                    } else {
                        console.log(stderr);
                        applications.findOneAndUpdate({ _id: id }, { status: "ON" }, function (err, obj) {
                            res.status(200).json({
                                message: 'ON',
                                status: 200
                            });
                        });
                    }
                })
            } catch (e) {
                console.log(e);
            }
        });

        var dir = "../tmp/" + id;

        if (fs.existsSync(dir)) {
            fs.rmSync(dir, { recursive: true, force: true });
        }
    } catch (error) {
        writeLog(id, error.toString());
        res.status(200).json({
            message: 'OFF',
            status: 200
        });
    }
});

/**
 * Attribue un fichier à une application
 * ( =!upload )
 */
app.put('/api/file', (req, res) => {
    let id = req.body.id;
    let fileName = req.body.fileName;
    let type = req.body.type;

    if (type === 'source') {
        applications.updateOne({ _id: id }, { $push: { 'sourceFiles': { 'name': fileName, 'status': "no" } } }, function (err, obj) {
            applications.findOne({ _id: id }, { sourceFiles: 1 }, function (err, obj) {
                res.status(200).json({
                    files: obj.sourceFiles
                });
            });
        });
    } else if (type === 'config') {
        applications.updateOne({ _id: id }, { $push: { 'configFiles': { 'name': fileName, 'status': "no" } } }, function (err, obj) {
            applications.findOne({ _id: id }, { configFiles: 1 }, function (err, obj) {
                res.status(200).json({
                    files: obj.configFiles
                });
            });
        });
    }
});

// DELETE
/**
 * Supprime une application
 */
app.delete('/api/app', (req, res) => {
    let id = req.body.id
    applications.deleteOne({ _id: id }, function (err, obj) {
        var dir = "../files/" + id;

        if (fs.existsSync(dir)) {
            fs.rmSync(dir, { recursive: true, force: true });
        }

        res.status(200).json({
            message: 'Application supprimée',
            status: 200
        });
    });
});

/**
 * Désattribut un fichier d'une application.
 */
app.delete('/api/filebdd', (req, res) => {
    let id = req.body.id;
    let fileName = req.body.fileName;
    let type = req.body.type;

    if (type === 'source')
        applications.updateOne({ _id: id }, { $pull: { 'sourceFiles': { 'name': fileName } } }, function (err, obj) {
            var file = "../files/" + id + "/source/" + fileName;
            if (fs.existsSync(file)) {
                fs.rmSync(file);
            }

            applications.findOne({ _id: id }, { sourceFiles: 1 }, function (err, obj) {
                res.status(200).json({
                    files: obj.sourceFiles
                });
            });
        });
    else if (type === 'config')
        applications.updateOne({ _id: id }, { $pull: { 'configFiles': { 'name': fileName } } }, function (err, obj) {
            var file = "../files/" + id + "/conf/" + fileName;
            if (fs.existsSync(file)) {
                fs.rmSync(file);
            }

            applications.findOne({ _id: id }, { configFiles: 1 }, function (err, obj) {
                res.status(200).json({
                    files: obj.configFiles
                });
            });
        });
});

/**
 * Supprime un fichier d'une application.
 * Le fichier est toujours attribué à l'application.
 */
app.delete('/api/fileuploaded', (req, res) => {
    let id = req.body.id;
    let fileName = req.body.fileName;
    let type = req.body.type;

    if (type === 'source')
        applications.findOneAndUpdate({ _id: id, 'sourceFiles.name': fileName }, { 'sourceFiles.$.status': "no" }, function (err, obj) {
            var file = "../files/" + id + "/source/" + fileName;
            if (fs.existsSync(file)) {
                fs.rmSync(file);
            }

            applications.findOne({ _id: id }, { sourceFiles: 1 }, function (err, obj) {
                res.status(200).json({
                    files: obj.sourceFiles
                });
            });
        });
    else if (type === 'config')
        applications.findOneAndUpdate({ _id: id, 'configFiles.name': fileName }, { 'configFiles.$.status': "no" }, function (err, obj) {
            var file = "../files/" + id + "/conf/" + fileName;
            if (fs.existsSync(file)) {
                fs.rmSync(file);
            }

            applications.findOne({ _id: id }, { configFiles: 1 }, function (err, obj) {
                res.status(200).json({
                    files: obj.configFiles
                });
            });
        });
});

// FONCTIONS
/**
 * Écrit les logs dans le fichier logs.log
 */
function writeLog(id, message) {
    var dir = "../files/" + id + "/";

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    process.env.TZ = 'Europe/Paris';
    var data = "--------------------------------------------------------------\n"
        + new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }).
            replace(/T/, ' ').
            replace(/\..+/, '')
        + "\n--------------------------------------------------------------\n"
        + message + "\n";

    fs.appendFile(dir + "logs.log", data, function (err) {
        if (err) throw err;
    });
}