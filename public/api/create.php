<?php
// POST { ownerName, questions: [{ text, choices[], correctIndex }] } → { slug, adminKey }
require __DIR__ . '/_bootstrap.php';

handle('POST', function () {
    $body = json_body();
    $name = clean_name($body['ownerName'] ?? '');
    $raw = $body['questions'] ?? null;
    if (!is_array($raw) || !array_is_list($raw)) throw new InputError('Questions invalides.');

    $questions = [];
    foreach ($raw as $i => $q) {
        $n = $i + 1;
        $text = clean_text($q['text'] ?? '', LIMITS['question']);
        $choices = is_array($q['choices'] ?? null) ? array_values($q['choices']) : [];
        $choices = array_map(fn($c) => clean_text($c, LIMITS['choice']), $choices);
        $correct = $q['correctIndex'] ?? null;
        if ($text === '') throw new InputError("La question $n est vide.");
        if (count($choices) < LIMITS['minChoices'] || count($choices) > LIMITS['maxChoices'] || in_array('', $choices, true)) {
            throw new InputError("La question $n doit avoir entre " . LIMITS['minChoices'] . ' et ' . LIMITS['maxChoices'] . ' réponses remplies.');
        }
        if (!is_int($correct) || $correct < 0 || $correct >= count($choices)) {
            throw new InputError("Choisis la bonne réponse de la question $n.");
        }
        $questions[] = [$text, $choices, $correct];
    }
    if (count($questions) < LIMITS['minQuestions'] || count($questions) > LIMITS['maxQuestions']) {
        throw new InputError('Il faut entre ' . LIMITS['minQuestions'] . ' et ' . LIMITS['maxQuestions'] . ' questions.');
    }

    $slug = random_id(8);
    $adminKey = random_id(24);
    $pdo = db();
    $pdo->beginTransaction();
    $pdo->prepare('INSERT INTO quizzes (slug, admin_key, owner_name, created_at) VALUES (?, ?, ?, ?)')
        ->execute([$slug, $adminKey, $name, now()]);
    $quizId = (int) $pdo->lastInsertId();
    $insert = $pdo->prepare('INSERT INTO questions (quiz_id, position, text, choices, correct_index) VALUES (?, ?, ?, ?, ?)');
    foreach ($questions as $position => [$text, $choices, $correct]) {
        $insert->execute([$quizId, $position, $text, json_encode($choices, JSON_UNESCAPED_UNICODE), $correct]);
    }
    $pdo->commit();

    return ['slug' => $slug, 'adminKey' => $adminKey];
});
