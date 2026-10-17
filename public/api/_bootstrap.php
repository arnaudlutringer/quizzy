<?php
// Chargé par chaque endpoint : config, connexion à la base, helpers JSON.

declare(strict_types=1);

const LIMITS = [
    'name' => 40,
    'question' => 140,
    'choice' => 80,
    'minQuestions' => 3,
    'maxQuestions' => 20,
    'minChoices' => 2,
    'maxChoices' => 4,
];

final class InputError extends Exception {}

function config(): array
{
    static $config = null;
    if ($config !== null) return $config;
    $defaults = [
        // SQLite par défaut : aucun serveur de base à installer.
        'dsn' => 'sqlite:' . dirname(__DIR__, 2) . '/data/quizzy.sqlite',
        'user' => null,
        'password' => null,
        // Origines autorisées à appeler l'API depuis un autre port (ex. `npm run dev`).
        'cors_origins' => ['http://localhost:3000'],
    ];
    $local = is_file(__DIR__ . '/config.php') ? require __DIR__ . '/config.php' : [];
    return $config = array_merge($defaults, is_array($local) ? $local : []);
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo) return $pdo;
    $c = config();
    if (str_starts_with($c['dsn'], 'sqlite:')) {
        $dir = dirname(substr($c['dsn'], 7));
        if (!is_dir($dir)) mkdir($dir, 0775, true);
    }
    $pdo = new PDO($c['dsn'], $c['user'], $c['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    if ($pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite') {
        $pdo->exec('PRAGMA foreign_keys = ON');
    }
    migrate($pdo);
    return $pdo;
}

// Crée les tables au premier appel (SQLite et MySQL).
function migrate(PDO $pdo): void
{
    $mysql = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql';
    $id = $mysql ? 'INT AUTO_INCREMENT PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
    $text = $mysql ? 'VARCHAR(255)' : 'TEXT';
    $suffix = $mysql ? ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4' : '';
    $pdo->exec("CREATE TABLE IF NOT EXISTS quizzes (
        id $id,
        slug $text NOT NULL UNIQUE,
        admin_key $text NOT NULL,
        owner_name $text NOT NULL,
        created_at $text NOT NULL
    )$suffix");
    $pdo->exec("CREATE TABLE IF NOT EXISTS questions (
        id $id,
        quiz_id INT NOT NULL,
        position INT NOT NULL,
        text $text NOT NULL,
        choices TEXT NOT NULL,
        correct_index INT NOT NULL,
        FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE
    )$suffix");
    $pdo->exec("CREATE TABLE IF NOT EXISTS attempts (
        id $id,
        quiz_id INT NOT NULL,
        player_name $text NOT NULL,
        answers TEXT NOT NULL,
        score INT NOT NULL,
        total INT NOT NULL,
        created_at $text NOT NULL,
        FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE
    )$suffix");
}

function cors(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin && in_array($origin, config()['cors_origins'], true)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Headers: Content-Type');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Vary: Origin');
    }
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function respond(mixed $data, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Point d'entrée de chaque endpoint : gère CORS, la méthode et les erreurs.
function handle(string $method, callable $fn): never
{
    cors();
    if ($_SERVER['REQUEST_METHOD'] !== $method) respond(['error' => 'Méthode non autorisée.'], 405);
    try {
        respond($fn());
    } catch (InputError $e) {
        respond(['error' => $e->getMessage()], 400);
    } catch (Throwable $e) {
        error_log('[quizzy] ' . $e);
        respond(['error' => 'Une erreur est survenue, réessaie dans un instant.'], 500);
    }
}

function json_body(): array
{
    $body = json_decode(file_get_contents('php://input') ?: '', true);
    if (!is_array($body)) throw new InputError('Requête invalide.');
    return $body;
}

function not_found(): never
{
    respond(['error' => "Ce quiz n'existe pas."], 404);
}

function random_id(int $length): string
{
    $alphabet = 'abcdefghijkmnopqrstuvwxyz23456789';
    $out = '';
    for ($i = 0; $i < $length; $i++) $out .= $alphabet[random_int(0, strlen($alphabet) - 1)];
    return $out;
}

function clean_text(mixed $raw, int $max): string
{
    return mb_substr(trim(is_scalar($raw) ? (string) $raw : ''), 0, $max);
}

function clean_name(mixed $raw): string
{
    $name = clean_text($raw, LIMITS['name']);
    if ($name === '') throw new InputError('Indique un prénom.');
    return $name;
}

function now(): string
{
    return gmdate('Y-m-d\TH:i:s\Z');
}

function load_quiz(string $slug): ?array
{
    $stmt = db()->prepare('SELECT id, slug, admin_key, owner_name FROM quizzes WHERE slug = ?');
    $stmt->execute([$slug]);
    $quiz = $stmt->fetch();
    if (!$quiz) return null;
    $stmt = db()->prepare('SELECT id, text, choices, correct_index FROM questions WHERE quiz_id = ? ORDER BY position');
    $stmt->execute([$quiz['id']]);
    $quiz['questions'] = array_map(fn($q) => [
        'id' => (string) $q['id'],
        'text' => $q['text'],
        'choices' => json_decode($q['choices'], true),
        'correctIndex' => (int) $q['correct_index'],
    ], $stmt->fetchAll());
    return $quiz;
}

function attempts(int $quizId): array
{
    $stmt = db()->prepare(
        'SELECT player_name, answers, score, total, created_at FROM attempts
         WHERE quiz_id = ? ORDER BY score DESC, created_at ASC, id ASC LIMIT 200'
    );
    $stmt->execute([$quizId]);
    return array_map(fn($a) => [
        'playerName' => $a['player_name'],
        'score' => (int) $a['score'],
        'total' => (int) $a['total'],
        'createdAt' => $a['created_at'],
        'answers' => json_decode($a['answers'], true),
    ], $stmt->fetchAll());
}

// Classement public : sans le détail des réponses.
function leaderboard(int $quizId): array
{
    return array_map(fn($a) => array_diff_key($a, ['answers' => 1]), attempts($quizId));
}

function slug_param(): string
{
    return clean_text($_GET['id'] ?? '', 32);
}
