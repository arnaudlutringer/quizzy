<?php
// GET ?id=<slug> → classement public.
require __DIR__ . '/_bootstrap.php';

handle('GET', function () {
    $quiz = load_quiz(slug_param()) ?? not_found();
    return ['ownerName' => $quiz['owner_name'], 'entries' => leaderboard((int) $quiz['id'])];
});
