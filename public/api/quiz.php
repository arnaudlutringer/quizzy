<?php
// GET ?id=<slug> → le quiz tel que le voit un joueur, sans les bonnes réponses.
require __DIR__ . '/_bootstrap.php';

handle('GET', function () {
    $quiz = load_quiz(slug_param()) ?? not_found();
    return [
        'slug' => $quiz['slug'],
        'ownerName' => $quiz['owner_name'],
        'questions' => array_map(fn($q) => array_diff_key($q, ['correctIndex' => 1]), $quiz['questions']),
    ];
});
