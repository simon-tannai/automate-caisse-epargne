# Automate Caisse d'Epargne
Automate Node.js pour se connecter automatiquement à son compte client.

## Installation
Lancer la commande `npm install`.
Dupliquer le fichier `bundles/caisse-epargne-automate/config.sample.json` et le renommer en `config.json`.
Dans ce dernier, entrer vos identifiants de connexion à votre compte en ligne Caisse d'Epargne.

## Mode développement
Lancer la commande `npm run dev`

## Utiliser
Par exemple, vous pouvez utiliser CURL:

`curl 127.0.0.1:8080/caisse-epargne/getAccountsBalance`
