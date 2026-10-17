<?php
// POST ?id=<slug> { playerName, answers[] } → score, correction et classement.
require __DIR__ . '/_bootstrap.php';

handle('POST', function () {
    $quiz = load_quiz(slug_param()) ?? not_found();
    $body = json_body();
    $name = clean_name($body['playerName'] ?? '');
    $questions = $quiz['questions'];
    $answers = $body['answers'] ?? null;

    if (!is_array($answers) || !array_is_list($answers) || count($answers) !== count($questions)) {
        throw new InputError('Réponds à toutes les questions.');
    }
    $score = 0;
    foreach ($answers as $i => $a) {
        if (!is_int($a) || $a < 0 || $a >= count($questions[$i]['choices'])) throw new InputError('Réponse invalide.');
        if ($a === $questions[$i]['correctIndex']) $score++;
    }

    $createdAt = now();
    db()->prepare('INSERT INTO attempts (quiz_id, player_name, answers, score, total, created_at) VALUES (?, ?, ?, ?, ?, ?)')
        ->execute([$quiz['id'], $name, json_encode($answers), $score, count($questions), $createdAt]);

    return [
        'score' => $score,
        'total' => count($questions),
        'createdAt' => $createdAt,
        'correction' => array_map(fn($q, $a) => [
            'text' => $q['text'],
            'choices' => $q['choices'],
            'correctIndex' => $q['correctIndex'],
            'answerIndex' => $a,
        ], $questions, $answers),
        'leaderboard' => leaderboard((int) $quiz['id']),
    ];
});
