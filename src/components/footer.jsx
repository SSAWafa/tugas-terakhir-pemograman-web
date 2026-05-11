import { Link } from "react-router-dom";
import "../styles/footer.css";

const footerLinks = {
  belajar: {
    jp: "まなぶ",
    label: "Belajar",
    links: [
      { to: "/hiragana",   label: "Hiragana" },
      { to: "/katakana",   label: "Katakana" },
      { to: "/kanji",      label: "Kanji Dasar" },
      { to: "/percakapan", label: "Percakapan" },
      { to: "/tatabahasa", label: "Tata Bahasa" },
    ],
  },
  latihan: {
    jp: "れんしゅう",
    label: "Latihan",
    links: [
      { to: "/kuis",       label: "Kuis Harian" },
      { to: "/flashcard",  label: "Flash Card" },
    ],
  },
  info: {
    jp: "じょうほう",
    label: "Info",
    links: [
      { to: "/about",   label: "Tentang Kami" },
      { to: "/blog",    label: "Blog" },
      { to: "/faq",     label: "FAQ" },
      { to: "/contact", label: "Hubungi Kami" },
    ],
  },
};

const jlptLevels = ["N5", "N4", "N3", "N2", "N1"];

export default function Footer() {
  return (
    <footer className="footer">
      {/* Red accent line */}
      <div className="footer__accent" />

      <div className="footer__inner">
        {/* Brand */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <div className="footer__logo-kanji">日</div>
            <div>
              <div className="footer__logo-main">NihonGo!</div>
              <div className="footer__logo-sub">Belajar Bahasa Jepang</div>
            </div>
          </Link>
          <p className="footer__tagline">
            Platform belajar bahasa Jepang dari nol hingga mahir, lengkap dengan
            hiragana, katakana, kanji, dan percakapan sehari-hari.
          </p>
          <div className="footer__hiragana">あいうえお</div>
          <div className="footer__socials">
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer__social" aria-label="YouTube">YT</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer__social" aria-label="Instagram">IG</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer__social" aria-label="Twitter">TW</a>
          </div>
        </div>

        {/* Link groups */}
        <div className="footer__groups">
          {Object.values(footerLinks).map(({ jp, label, links }) => (
            <div key={label} className="footer__group">
              <div className="footer__group-jp">{jp}</div>
              <h4 className="footer__group-title">{label}</h4>
              <ul className="footer__group-links">
                {links.map(({ to, label: linkLabel }) => (
                  <li key={to}>
                    <Link to={to} className="footer__link">{linkLabel}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* JLPT badges */}
      <div className="footer__jlpt">
        <span className="footer__jlpt-label">Level JLPT:</span>
        {jlptLevels.map((lvl) => (
          <Link
            key={lvl}
            to={`/jlpt/${lvl.toLowerCase()}`}
            className={`footer__badge footer__badge--${lvl.toLowerCase()}`}
          >
            {lvl}
          </Link>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <p className="footer__copy">
          © {new Date().getFullYear()} NihonGo! — がんばってください 🎌
        </p>
        <p className="footer__copy">
          <Link to="/privacy" className="footer__bottom-link">Privasi</Link>
          {" · "}
          <Link to="/terms" className="footer__bottom-link">Syarat & Ketentuan</Link>
        </p>
      </div>
    </footer>
  );
}