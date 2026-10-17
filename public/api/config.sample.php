<?php
// Copie ce fichier en config.php (dans le même dossier) pour changer la configuration.
// Sans config.php, Quizzy utilise SQLite dans data/quizzy.sqlite à la racine du repo.

return [
    // MySQL / MariaDB :
    // 'dsn' => 'mysql:host=127.0.0.1;dbname=quizzy;charset=utf8mb4',
    // 'user' => 'root',
    // 'password' => '',

    // SQLite ailleurs :
    // 'dsn' => 'sqlite:/chemin/vers/quizzy.sqlite',

    // Origines autorisées à appeler l'API depuis un autre port (développement)
    // ou depuis l'app mobile (Android : https://localhost, iOS : capacitor://localhost).
    // 'cors_origins' => ['http://localhost:3000', 'https://localhost', 'capacitor://localhost'],
];
