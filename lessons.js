/* ============================================================
   ROWEL CHESS OS — lessons.js
   Concept library for "Learning-Based Chess Play".
   Maps move classifications (from chess-engine.js) to short,
   beginner-friendly explanations shown after each move.
   ============================================================ */

const LESSONS = {
  fork: {
    icon: '🍴',
    en: { title: 'Fork!', text: 'One piece is now attacking two enemy pieces at once. Your opponent can only save one — a fork wins material by force.' },
    ar: { title: 'شوكة!', text: 'قطعة واحدة تهاجم الآن قطعتين للخصم في آن واحد. لا يمكن للخصم إنقاذ سوى واحدة — الشوكة تكسب قطعة بالقوة.' },
    fr: { title: 'Fourchette !', text: 'Une seule pièce attaque maintenant deux pièces adverses à la fois. L\'adversaire ne peut en sauver qu\'une — la fourchette gagne du matériel par la force.' },
    es: { title: '¡Horquilla!', text: 'Una sola pieza ataca ahora a dos piezas enemigas a la vez. El rival solo puede salvar una — la horquilla gana material por la fuerza.' }
  },
  pin: {
    icon: '📌',
    en: { title: 'Pin', text: 'This piece is pinned — it can\'t move without exposing a more valuable piece (often the king) behind it. Pinned pieces are weak attackers and easy targets.' },
    ar: { title: 'تثبيت', text: 'هذه القطعة مثبّتة — لا يمكنها التحرك دون كشف قطعة أهم خلفها (غالبًا الملك). القطع المثبتة ضعيفة في الهجوم وسهلة الاستهداف.' },
    fr: { title: 'Clouage', text: 'Cette pièce est clouée — elle ne peut pas bouger sans exposer une pièce plus précieuse (souvent le roi) derrière elle. Les pièces clouées sont des cibles faciles.' },
    es: { title: 'Clavada', text: 'Esta pieza está clavada — no puede moverse sin exponer una pieza más valiosa (a menudo el rey) detrás de ella. Las piezas clavadas son objetivos fáciles.' }
  },
  skewer: {
    icon: '🎯',
    en: { title: 'Skewer', text: 'A skewer attacks a valuable piece that must move, exposing a less valuable piece behind it for capture — the reverse of a pin.' },
    ar: { title: 'تسليخ', text: 'التسليخ يهاجم قطعة قيّمة يجب أن تتحرك، مما يكشف قطعة أقل قيمة خلفها للاستيلاء عليها — وهو عكس التثبيت.' },
    fr: { title: 'Enfilade', text: 'Une enfilade attaque une pièce précieuse qui doit bouger, exposant une pièce moins précieuse derrière elle à la capture — l\'inverse d\'un clouage.' },
    es: { title: 'Enfilada', text: 'Una enfilada ataca a una pieza valiosa que debe moverse, dejando expuesta a una pieza menos valiosa detrás para ser capturada — lo opuesto a una clavada.' }
  },
  capture: {
    icon: '⚔️',
    en: { title: 'Capture', text: 'Material has changed hands. Always recheck the board afterward — captures often open new lines for both sides.' },
    ar: { title: 'استيلاء', text: 'تغيرت ملكية قطعة. تحقق دائمًا من الرقعة بعد ذلك — الاستيلاءات غالبًا ما تفتح خطوطًا جديدة لكلا الطرفين.' },
    fr: { title: 'Capture', text: 'Du matériel a changé de mains. Revérifiez toujours l\'échiquier ensuite — les captures ouvrent souvent de nouvelles lignes pour les deux camps.' },
    es: { title: 'Captura', text: 'El material ha cambiado de manos. Vuelve a revisar el tablero después — las capturas suelen abrir nuevas líneas para ambos bandos.' }
  },
  check: {
    icon: '⚡',
    en: { title: 'Check', text: 'The king is under attack and must respond — by blocking, capturing the attacker, or moving to safety. Checks can be used to gain tempo.' },
    ar: { title: 'كش', text: 'الملك تحت الهجوم ويجب أن يستجيب — إما بالحجب أو بأسر المهاجم أو بالانتقال إلى مكان آمن. يمكن استخدام الكش لكسب زمن.' },
    fr: { title: 'Échec', text: 'Le roi est attaqué et doit réagir — en bloquant, en capturant l\'attaquant, ou en se mettant à l\'abri. Les échecs peuvent servir à gagner du tempo.' },
    es: { title: 'Jaque', text: 'El rey está bajo ataque y debe responder — bloqueando, capturando al atacante o moviéndose a un lugar seguro. Los jaques pueden usarse para ganar tiempo.' }
  },
  checkmate: {
    icon: '👑',
    en: { title: 'Checkmate!', text: 'The king is in check with no legal way out. Game over — study this final position to recognize the mating pattern next time.' },
    ar: { title: 'كش ملك!', text: 'الملك في وضع كش دون أي مخرج قانوني. انتهت اللعبة — ادرس هذا الوضع النهائي للتعرف على نمط كش الملك في المرة القادمة.' },
    fr: { title: 'Échec et mat !', text: 'Le roi est en échec sans issue légale. Partie terminée — étudiez cette position finale pour reconnaître ce motif de mat la prochaine fois.' },
    es: { title: '¡Jaque mate!', text: 'El rey está en jaque sin salida legal. Fin de la partida — estudia esta posición final para reconocer el patrón de mate la próxima vez.' }
  },
  promotion: {
    icon: '👸',
    en: { title: 'Promotion', text: 'A pawn reached the final rank and became a queen — the most powerful piece. Pushing passed pawns is a key endgame skill.' },
    ar: { title: 'ترقية', text: 'وصل بيدق إلى الصف الأخير وتحول إلى ملكة — أقوى قطعة. دفع البيادق الممررة مهارة أساسية في نهاية اللعبة.' },
    fr: { title: 'Promotion', text: 'Un pion a atteint la dernière rangée et est devenu une dame — la pièce la plus puissante. Pousser les pions passés est une compétence clé en finale.' },
    es: { title: 'Promoción', text: 'Un peón llegó a la última fila y se convirtió en una dama — la pieza más poderosa. Avanzar peones pasados es una habilidad clave en los finales.' }
  },
  castling: {
    icon: '🏰',
    en: { title: 'Castling', text: 'The king tucked into safety and the rook joined the action — castling early is one of the strongest habits in chess.' },
    ar: { title: 'تبييت', text: 'انتقل الملك إلى مكان آمن وانضم الرخ إلى اللعب — التبييت المبكر من أقوى العادات في الشطرنج.' },
    fr: { title: 'Roque', text: 'Le roi s\'est mis à l\'abri et la tour est entrée en jeu — roquer tôt est l\'une des meilleures habitudes aux échecs.' },
    es: { title: 'Enroque', text: 'El rey se puso a salvo y la torre entró en juego — enrocar temprano es uno de los mejores hábitos en el ajedrez.' }
  },
  'en-passant': {
    icon: '👻',
    en: { title: 'En Passant', text: 'A special pawn capture: when an enemy pawn moves two squares and lands beside yours, you may capture it as if it had moved only one square.' },
    ar: { title: 'الأسر بالمرور', text: 'استيلاء خاص بالبيادق: عندما يتحرك بيدق العدو خانتين ويهبط بجانب بيدقك، يمكنك أسره كما لو تحرك خانة واحدة فقط.' },
    fr: { title: 'En Passant', text: 'Une capture spéciale : quand un pion adverse avance de deux cases et atterrit à côté du vôtre, vous pouvez le capturer comme s\'il n\'avait avancé que d\'une case.' },
    es: { title: 'Al Paso', text: 'Una captura especial de peón: cuando un peón enemigo avanza dos casillas y queda junto al tuyo, puedes capturarlo como si solo hubiera avanzado una casilla.' }
  },
  development: {
    icon: '♟️',
    en: { title: 'Development', text: 'A quiet developing move. In the opening, aim to bring out knights and bishops, control the center, and prepare to castle.' },
    ar: { title: 'تطوير', text: 'نقلة تطويرية هادئة. في الافتتاح، اهدف إلى إخراج الأحصنة والأفيال، والسيطرة على المركز، والاستعداد للتبييت.' },
    fr: { title: 'Développement', text: 'Un coup de développement tranquille. À l\'ouverture, sortez vos cavaliers et fous, contrôlez le centre, et préparez le roque.' },
    es: { title: 'Desarrollo', text: 'Un movimiento de desarrollo tranquilo. En la apertura, busca sacar caballos y alfiles, controlar el centro y prepararte para enrocar.' }
  },
  'hanging-pieces': {
    icon: '⚠️',
    en: { title: 'Hanging Piece', text: 'This piece can be captured for free! Always scan for undefended pieces before and after every move — this is the #1 source of blunders.' },
    ar: { title: 'قطعة معرضة', text: 'يمكن أسر هذه القطعة مجانًا! تحقق دائمًا من القطع غير المحمية قبل وبعد كل نقلة — هذا هو السبب الأول للأخطاء الفادحة.' },
    fr: { title: 'Pièce en prise', text: 'Cette pièce peut être capturée gratuitement ! Vérifiez toujours les pièces non défendues avant et après chaque coup — c\'est la cause n°1 des gaffes.' },
    es: { title: 'Pieza colgada', text: '¡Esta pieza puede ser capturada gratis! Revisa siempre las piezas indefensas antes y después de cada movimiento — es la causa número uno de los errores graves.' }
  },
  stalemate: {
    icon: '🤝',
    en: { title: 'Stalemate', text: 'The side to move has no legal moves but is not in check — the game is a draw. Watch for stalemate traps when you have a big material advantage!' },
    ar: { title: 'تعادل بالجمود', text: 'الطرف الذي يجب أن يلعب ليس لديه نقلات قانونية لكنه ليس في كش — اللعبة تعادل. احذر من فخاخ الجمود عندما يكون لديك تفوق مادي كبير!' },
    fr: { title: 'Pat', text: 'Le camp au trait n\'a aucun coup légal mais n\'est pas en échec — la partie est nulle. Attention aux pièges de pat quand vous avez un gros avantage matériel !' },
    es: { title: 'Ahogado', text: 'El bando que debe mover no tiene jugadas legales pero no está en jaque — la partida es tablas. ¡Cuidado con las trampas de ahogado cuando tienes gran ventaja material!' }
  }
};

/**
 * Get a lesson object for a given concept tag in the current language.
 * @param {string} tag - one of the LESSONS keys
 * @returns {{icon: string, title: string, text: string}}
 */
function getLesson(tag) {
  const lesson = LESSONS[tag];
  if (!lesson) return null;
  const lang = (typeof CURRENT_LANG !== 'undefined') ? CURRENT_LANG : 'en';
  const localized = lesson[lang] || lesson.en;
  return { icon: lesson.icon, title: localized.title, text: localized.text };
}

/**
 * Get lessons for an array of concept tags (from engine.classifyMove).
 * @param {string[]} tags
 * @returns {Array}
 */
function getLessonsForTags(tags) {
  return tags.map(getLesson).filter(Boolean);
}
