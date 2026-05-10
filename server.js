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

/**
 * Implémentation de la méthode SayHello.
 * @param {grpc.ServerUnaryCall} call - L'appel entrant contenant call.request.name
 * @param {grpc.sendUnaryData} callback - Callback pour renvoyer la réponse ou une erreur
 */
function sayHello(call, callback) {
    const rawName = call.request?.name ?? '';
    const name = String(rawName).trim() || 'inconnu';
    callback(null, { message: `Bonjour, ${name} !` });
}

/**
 * Démarre le serveur gRPC sur le port 50051.
 */
function main() {
    const server = new grpc.Server();

    // Enregistrement du service avec son implémentation
    server.addService(helloProto.Greeter.service, { sayHello });

    server.bindAsync(
        '0.0.0.0:50051',
        grpc.ServerCredentials.createInsecure(),
        (err, port) => {
            if (err) {
                console.error('Erreur de démarrage du serveur gRPC :', err);
                return;
            }
            console.log(`Serveur gRPC démarré sur 0.0.0.0:${port}`);
        }
    );
}

main();
