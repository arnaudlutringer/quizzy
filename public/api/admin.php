<?php
// GET ?id=<slug>&key=<clé secrète> → vue du créateur, avec les réponses de chaque ami.
require __DIR__ . '/_bootstrap.php';

handle('GET', function () {
    $quiz = load_quiz(slug_param());
    $key = is_string($_GET['key'] ?? null) ? $_GET['key'] : '';
    if (!$quiz || $key === '' || !hash_equals($quiz['admin_key'], $key)) not_found();
    return [
        'ownerName' => $quiz['owner_name'],
        'questions' => array_map(fn($q) => array_diff_key($q, ['id' => 1]), $quiz['questions']),
        'attempts' => attempts((int) $quiz['id']),
    ];
});
