# Application conteneurisation

Cette application permet de lancer des applications conteneurisées depuis une interface web.

## Installation

Suivre les instructions sur [la page Confluence](https://si-confluence.edf.fr/display/dn2gsystemteam/Conteneurisation+-+Podman)

## Utilisation

Depuis la page principale, créer une application via le bouton `Créer`.
Le nom de l'application doit être `unique` mais son INS peut etre utilisé plusieurs fois, la description est facultative.

Une fois l'application créée il faut la configurer via la page `Configuration` :
- Dockerfiles : ajouter les dockerfiles `front et back ainsi que leur port`
- Le(s) fichier(s) `source`
- Le(s) fichier(s) de `configuration`

Cliquer sur `Enregistrer`.
Depuis la page `Visualisation` les fichiers peuvent être upload sois via le bouton dans la ligne du fichier choisi sois en `glisser/déposer`.
L'application est prête à être démarrée, cliquer sur le bouton `Lancer` depuis la page de visualisation ou la page principale.

Les logs du lancement sont disponibles via le bouton `Logs'.
