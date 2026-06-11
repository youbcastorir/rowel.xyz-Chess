/* ============================================================
   ROWEL CHESS OS — feed.js
   TikTok-style vertical chess feed: 1-minute lessons, tactical
   highlights, and famous game moments.
   ============================================================ */

/** Feed item definitions with i18n keys */
const FEED_ITEMS = [
  {
    id: 'f1', tag: 'feed.tag.tactic', gradient: 'linear-gradient(160deg, #1E1040, #F0B429)',
    titleKey: 'feed.item1.title', descKey: 'feed.item1.desc'
  },
  {
    id: 'f2', tag: 'feed.tag.legend', gradient: 'linear-gradient(160deg, #0A0A0F, #2DD4BF)',
    titleKey: 'feed.item2.title', descKey: 'feed.item2.desc'
  },
  {
    id: 'f3', tag: 'feed.tag.opening', gradient: 'linear-gradient(160deg, #2D1B4E, #A78BFA)',
    titleKey: 'feed.item3.title', descKey: 'feed.item3.desc'
  },
  {
    id: 'f4', tag: 'feed.tag.endgame', gradient: 'linear-gradient(160deg, #1A1A2E, #F87171)',
    titleKey: 'feed.item4.title', descKey: 'feed.item4.desc'
  },
  {
    id: 'f5', tag: 'feed.tag.tactic', gradient: 'linear-gradient(160deg, #0F2027, #34D399)',
    titleKey: 'feed.item5.title', descKey: 'feed.item5.desc'
  }
];

/** Trending topics for the sidebar */
const FEED_TOPICS = [
  { nameKey: 'topic.forks', count: '1.2k' },
  { nameKey: 'topic.italian', count: '980' },
  { nameKey: 'topic.endgames', count: '845' },
  { nameKey: 'topic.sacrifices', count: '742' },
  { nameKey: 'topic.worldchamp', count: '610' }
];

/** Feed-specific translations merged into TRANSLATIONS */
const FEED_TRANSLATIONS = {
  en: {
    'feed.tag.tactic': 'Tactic',
    'feed.tag.legend': 'Legendary Game',
    'feed.tag.opening': 'Opening',
    'feed.tag.endgame': 'Endgame',
    'feed.item1.title': 'The Smothered Mate',
    'feed.item1.desc': 'A knight delivers checkmate while the king is trapped by its own pieces. One of chess\'s most elegant patterns.',
    'feed.item2.title': "Kasparov's Immortal Sacrifice",
    'feed.item2.desc': 'Garry Kasparov sacrifices his queen to unleash a devastating attack — a moment chess fans still study today.',
    'feed.item3.title': 'The Italian Game in 60 Seconds',
    'feed.item3.desc': 'One of the oldest openings: control the center, develop fast, and aim your bishop at f7.',
    'feed.item4.title': 'King + Pawn vs King',
    'feed.item4.desc': 'The most fundamental endgame. Master "the opposition" and you\'ll convert won endgames for life.',
    'feed.item5.title': 'The Greek Gift Sacrifice',
    'feed.item5.desc': 'Bxh7+! A classic bishop sacrifice that rips open the enemy king\'s shelter — recognize this pattern and win games.',
    'topic.forks': 'Forks & Tactics',
    'topic.italian': 'Italian Game',
    'topic.endgames': 'Endgame Studies',
    'topic.sacrifices': 'Famous Sacrifices',
    'topic.worldchamp': 'World Championship'
  },
  ar: {
    'feed.tag.tactic': 'تكتيك',
    'feed.tag.legend': 'مباراة أسطورية',
    'feed.tag.opening': 'افتتاح',
    'feed.tag.endgame': 'نهاية اللعبة',
    'feed.item1.title': 'كش الملك الخانق',
    'feed.item1.desc': 'حصان ينفذ كش ملك بينما يكون الملك محاصرًا بقطعه الخاصة. أحد أجمل الأنماط في الشطرنج.',
    'feed.item2.title': 'تضحية كاسباروف الخالدة',
    'feed.item2.desc': 'يضحي غاري كاسباروف بملكته لإطلاق هجوم مدمر — لحظة لا يزال محبو الشطرنج يدرسونها حتى اليوم.',
    'feed.item3.title': 'الافتتاح الإيطالي في 60 ثانية',
    'feed.item3.desc': 'أحد أقدم الافتتاحيات: سيطر على المركز، طوّر بسرعة، ووجّه فيلك نحو f7.',
    'feed.item4.title': 'ملك + بيدق ضد ملك',
    'feed.item4.desc': 'أهم نهاية لعبة أساسية. أتقن "المعارضة" وستحول النهايات الرابحة طوال حياتك.',
    'feed.item5.title': 'تضحية الهدية اليونانية',
    'feed.item5.desc': 'Bxh7+! تضحية فيل كلاسيكية تمزق ملجأ ملك الخصم — تعرّف على هذا النمط واربح المباريات.',
    'topic.forks': 'الشوكات والتكتيكات',
    'topic.italian': 'الافتتاح الإيطالي',
    'topic.endgames': 'دراسات النهايات',
    'topic.sacrifices': 'تضحيات شهيرة',
    'topic.worldchamp': 'بطولة العالم'
  },
  fr: {
    'feed.tag.tactic': 'Tactique',
    'feed.tag.legend': 'Partie légendaire',
    'feed.tag.opening': 'Ouverture',
    'feed.tag.endgame': 'Finale',
    'feed.item1.title': 'Le Mat étouffé',
    'feed.item1.desc': 'Un cavalier livre l\'échec et mat pendant que le roi est piégé par ses propres pièces. L\'un des motifs les plus élégants des échecs.',
    'feed.item2.title': 'Le sacrifice immortel de Kasparov',
    'feed.item2.desc': 'Garry Kasparov sacrifie sa dame pour déclencher une attaque dévastatrice — un moment encore étudié aujourd\'hui.',
    'feed.item3.title': 'La Partie italienne en 60 secondes',
    'feed.item3.desc': 'L\'une des plus anciennes ouvertures : contrôlez le centre, développez rapidement, et visez f7 avec votre fou.',
    'feed.item4.title': 'Roi + Pion contre Roi',
    'feed.item4.desc': 'La finale la plus fondamentale. Maîtrisez "l\'opposition" et vous convertirez les finales gagnées à vie.',
    'feed.item5.title': 'Le sacrifice du cadeau grec',
    'feed.item5.desc': 'Fxh7+ ! Un sacrifice de fou classique qui déchire l\'abri du roi adverse — reconnaissez ce motif et gagnez des parties.',
    'topic.forks': 'Fourchettes & Tactiques',
    'topic.italian': 'Partie italienne',
    'topic.endgames': 'Études de finales',
    'topic.sacrifices': 'Sacrifices célèbres',
    'topic.worldchamp': 'Championnat du monde'
  },
  es: {
    'feed.tag.tactic': 'Táctica',
    'feed.tag.legend': 'Partida legendaria',
    'feed.tag.opening': 'Apertura',
    'feed.tag.endgame': 'Final',
    'feed.item1.title': 'El Mate sofocado',
    'feed.item1.desc': 'Un caballo da jaque mate mientras el rey queda atrapado por sus propias piezas. Uno de los patrones más elegantes del ajedrez.',
    'feed.item2.title': 'El sacrificio inmortal de Kasparov',
    'feed.item2.desc': 'Garry Kasparov sacrifica su dama para desatar un ataque devastador — un momento que los aficionados aún estudian hoy.',
    'feed.item3.title': 'La Apertura Italiana en 60 segundos',
    'feed.item3.desc': 'Una de las aperturas más antiguas: controla el centro, desarrolla rápido y apunta tu alfil hacia f7.',
    'feed.item4.title': 'Rey + Peón contra Rey',
    'feed.item4.desc': 'El final más fundamental. Domina "la oposición" y convertirás finales ganados de por vida.',
    'feed.item5.title': 'El sacrificio del regalo griego',
    'feed.item5.desc': '¡Axh7+! Un sacrificio de alfil clásico que destroza el refugio del rey enemigo — reconoce este patrón y gana partidas.',
    'topic.forks': 'Horquillas y tácticas',
    'topic.italian': 'Apertura Italiana',
    'topic.endgames': 'Estudios de finales',
    'topic.sacrifices': 'Sacrificios famosos',
    'topic.worldchamp': 'Campeonato Mundial'
  }
};

(function mergeFeedTranslations() {
  if (typeof TRANSLATIONS === 'undefined') return;
  Object.keys(FEED_TRANSLATIONS).forEach(lang => {
    Object.assign(TRANSLATIONS[lang], FEED_TRANSLATIONS[lang]);
  });
})();

/**
 * Render the vertical feed items into #feedScroll.
 */
function renderFeed() {
  const scroll = document.getElementById('feedScroll');
  if (!scroll) return;

  scroll.innerHTML = FEED_ITEMS.map(item => `
    <div class="feed-item" style="background:${item.gradient}">
      <div class="feed-item-overlay"></div>
      <div class="feed-item-content">
        <span class="feed-item-tag">${t(item.tag)}</span>
        <div class="feed-item-title">${t(item.titleKey)}</div>
        <div class="feed-item-desc">${t(item.descKey)}</div>
      </div>
    </div>
  `).join('');

  // Render trending topics sidebar
  const topicsEl = document.getElementById('feedTopics');
  if (topicsEl) {
    topicsEl.innerHTML = FEED_TOPICS.map(topic => `
      <div class="feed-topic">
        <span class="feed-topic-name">${t(topic.nameKey)}</span>
        <span class="feed-topic-count">${topic.count}</span>
      </div>
    `).join('');
  }
}

/**
 * Scroll the feed up or down by one item height.
 * @param {number} direction - 1 for next, -1 for previous
 */
function scrollFeed(direction) {
  const scroll = document.getElementById('feedScroll');
  if (!scroll) return;
  const itemHeight = scroll.clientHeight;
  scroll.scrollBy({ top: direction * itemHeight, behavior: 'smooth' });
}

/** Initialize feed navigation buttons */
function initFeed() {
  renderFeed();
  const prevBtn = document.getElementById('feedPrev');
  const nextBtn = document.getElementById('feedNext');
  if (prevBtn) prevBtn.addEventListener('click', () => scrollFeed(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollFeed(1));
}
