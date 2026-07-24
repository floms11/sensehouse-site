/**
 * Hero-сцена: авторська архітектурна ілюстрація SVG.
 * Сучасний будинок у сутінках, делікатні Smart Lines, що звʼязують
 * світло, клімат, безпеку та енергетику в одну систему.
 *
 * Це свідома альтернатива стоковим фото: жодних вигаданих обʼєктів.
 * Коли зʼявляться справжні фотографії Sense House, сцену можна
 * замінити або доповнити (див. README).
 */
export default function HeroScene({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 960 560"
      fill="none"
      role="img"
      aria-label="Схематичне зображення сучасного будинку, у якому світло, клімат, безпека та енергетика зʼєднані в одну систему"
      className={className}
    >
      <defs>
        {/* Сутінкове небо */}
        <linearGradient id="hs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050f26" />
          <stop offset="0.65" stopColor="#081a3a" />
          <stop offset="1" stopColor="#0c2148" />
        </linearGradient>
        {/* Тепле світло вікон */}
        <linearGradient id="hs-window" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4c45b" stopOpacity="0.5" />
          <stop offset="1" stopColor="#f4c45b" stopOpacity="0.14" />
        </linearGradient>
        <linearGradient id="hs-window-cool" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8edf3" stopOpacity="0.28" />
          <stop offset="1" stopColor="#e8edf3" stopOpacity="0.07" />
        </linearGradient>
        {/* Мʼяке світіння архітектурного підсвічування */}
        <radialGradient id="hs-glow" cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor="#f4c45b" stopOpacity="0.22" />
          <stop offset="1" stopColor="#f4c45b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hs-node-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#21b4ff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#21b4ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Небо */}
      <rect width="960" height="560" fill="url(#hs-sky)" />

      {/* Blueprint grid усередині сцени */}
      <g stroke="#e8edf3" strokeOpacity="0.05">
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`v${i}`} x1={i * 80} y1="0" x2={i * 80} y2="560" />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 80} x2="960" y2={i * 80} />
        ))}
      </g>

      {/* Лінія землі */}
      <line x1="40" y1="472" x2="920" y2="472" stroke="#e8edf3" strokeOpacity="0.35" strokeWidth="1.5" />

      {/* ---- Будинок: два обʼєми, плаский дах ---- */}

      {/* Головний обʼєм */}
      <rect x="200" y="252" width="400" height="220" stroke="#e8edf3" strokeOpacity="0.75" strokeWidth="1.5" />
      {/* Консоль даху */}
      <line x1="176" y1="252" x2="624" y2="252" stroke="#e8edf3" strokeOpacity="0.85" strokeWidth="2.5" />
      {/* Другий обʼєм */}
      <rect x="600" y="332" width="200" height="140" stroke="#e8edf3" strokeOpacity="0.6" strokeWidth="1.5" />
      <line x1="588" y1="332" x2="812" y2="332" stroke="#e8edf3" strokeOpacity="0.7" strokeWidth="2" />

      {/* Панорамне скління головного обʼєму */}
      <rect x="224" y="284" width="240" height="188" fill="url(#hs-window)" stroke="#e8edf3" strokeOpacity="0.4" />
      <line x1="304" y1="284" x2="304" y2="472" stroke="#081a3a" strokeWidth="3" />
      <line x1="384" y1="284" x2="384" y2="472" stroke="#081a3a" strokeWidth="3" />
      <line x1="224" y1="284" x2="464" y2="284" stroke="#e8edf3" strokeOpacity="0.3" />

      {/* Кам'яна вставка */}
      <rect x="488" y="284" width="88" height="188" stroke="#e8edf3" strokeOpacity="0.35" />
      <g stroke="#e8edf3" strokeOpacity="0.14">
        <line x1="488" y1="330" x2="576" y2="330" />
        <line x1="488" y1="378" x2="576" y2="378" />
        <line x1="488" y1="426" x2="576" y2="426" />
        <line x1="532" y1="284" x2="532" y2="330" />
        <line x1="510" y1="330" x2="510" y2="378" />
        <line x1="554" y1="378" x2="554" y2="426" />
      </g>

      {/* Вікно другого обʼєму — холодніше світло */}
      <rect x="624" y="360" width="120" height="112" fill="url(#hs-window-cool)" stroke="#e8edf3" strokeOpacity="0.35" />
      <line x1="684" y1="360" x2="684" y2="472" stroke="#081a3a" strokeWidth="3" />

      {/* Архітектурне підсвічування під консоллю */}
      <rect x="200" y="252" width="400" height="90" fill="url(#hs-glow)" />

      {/* Ворота праворуч */}
      <g stroke="#e8edf3" strokeOpacity="0.4">
        <line x1="836" y1="472" x2="836" y2="420" />
        <line x1="908" y1="472" x2="908" y2="420" />
        <line x1="836" y1="428" x2="908" y2="428" />
        <line x1="836" y1="444" x2="908" y2="444" />
        <line x1="836" y1="460" x2="908" y2="460" />
      </g>

      {/* Ландшафт зліва */}
      <g stroke="#e8edf3" strokeOpacity="0.3">
        <line x1="96" y1="472" x2="96" y2="452" />
        <circle cx="96" cy="440" r="14" fill="none" />
        <line x1="140" y1="472" x2="140" y2="458" />
        <circle cx="140" cy="448" r="10" fill="none" />
      </g>

      {/* ---- Smart Lines: система будинку ---- */}

      {/* Центральний вузол (щитова / серце системи) */}
      <circle cx="520" cy="512" r="44" fill="url(#hs-node-glow)" />
      <circle cx="520" cy="512" r="5" fill="#f4c45b" className="signal-dot" />
      <circle cx="520" cy="512" r="11" stroke="#f4c45b" strokeOpacity="0.5" fill="none" />

      <g stroke="#21b4ff" strokeWidth="1.5" strokeLinecap="round" opacity="0.75">
        {/* до освітлення */}
        <path d="M520 501v-13c0-6 -5-11 -11-11H273c-6 0-11-5-11-11V276" className="draw-line" style={{ ["--line-length" as string]: "560" }} />
        {/* до клімату (другий обʼєм) */}
        <path d="M531 512h134c6 0 11-5 11-11V392" className="draw-line" style={{ ["--line-length" as string]: "280" }} />
        {/* до безпеки (ворота) */}
        <path d="M531 517c96 8 226 8 296-69" opacity="0.55" className="draw-line" style={{ ["--line-length" as string]: "320" }} />
        {/* до енергетики (резервне живлення зліва) */}
        <path d="M509 512H190c-6 0-11-5-11-11v-49" opacity="0.55" className="draw-line" style={{ ["--line-length" as string]: "390" }} />
      </g>

      {/* Signal dots на вузлах підсистем */}
      <circle cx="262" cy="272" r="3.5" fill="#21b4ff" className="signal-dot" />
      <circle cx="676" cy="388" r="3.5" fill="#21b4ff" className="signal-dot" style={{ animationDelay: "0.8s" }} />
      <circle cx="830" cy="446" r="3.5" fill="#21b4ff" className="signal-dot" style={{ animationDelay: "1.6s" }} />
      <circle cx="179" cy="449" r="3.5" fill="#21b4ff" className="signal-dot" style={{ animationDelay: "2.4s" }} />

      {/* Підписи підсистем — інженерні маркування */}
      <g
        fill="#9fb0c8"
        fontSize="11"
        fontFamily="var(--font-grotesk), sans-serif"
        letterSpacing="0.14em"
      >
        <text x="248" y="248">СВІТЛО</text>
        <text x="656" y="318">КЛІМАТ</text>
        <text x="796" y="404">БЕЗПЕКА</text>
        <text x="132" y="404">ЖИВЛЕННЯ</text>
      </g>

      {/* House pulse на лінії землі */}
      <path
        d="M40 512h360l14-9 12 17 10-25 12 33 10-16h62"
        stroke="#21b4ff"
        strokeOpacity="0.35"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="house-pulse-line"
        pathLength="640"
      />
      <path d="M531 512h389" stroke="#21b4ff" strokeOpacity="0.15" strokeWidth="1.5" />
    </svg>
  );
}
