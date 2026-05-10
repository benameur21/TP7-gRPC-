'use strict';

const path = require('node:path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Chemin vers le fichier .proto
const PROTO_PATH = path.join(__dirname, 'hello.proto');

// Chargement du fichier proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const helloProto = grpc.loadPackageDefinition(packageDefinition).hello;

// Création du client gRPC connecté au serveur local sur le port 50051
const client = new helloProto.Greeter(
    'localhost:50051',
    grpc.credentials.createInsecure()
);

// Récupération du nom depuis les arguments CLI, sinon valeur par défaut
const nameArg = process.argv[2] || 'TestUser';

console.log(`Envoi de la requête SayHello avec name="${nameArg}"...`);

client.sayHello({ name: nameArg }, (err, response) => {
    if (err) {
        console.error('❌ Erreur côté client :', err.message);
        return;
    }
    console.log('Réponse du serveur :', response.message);
});
