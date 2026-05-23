import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../styles/navbar.css";

const navLinks = [
  { to: "/", label: "Mulai Belajar"},
  { to: "/hiragana", label: "Hiragana"},
  { to: "/katakana", label: "Katakana"},
  { to: "/kanji", label: "Daftar Kanji"},
  { to: "/kuis", label: "Kuis Kanji"},
  { to: "/flashcard", label: "Flashcard Kanji"},
  { to: "/about", label: "About Us"},
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
     

      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-kanji">日</div>
          <div className="navbar__logo-text">
            <span className="navbar__logo-main">NihonGo!</span>
            <span className="navbar__logo-sub">Belajar Bahasa Jepang</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="navbar__links">
          {navLinks.map(({ to, label, jp }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                isActive ? "navbar__link navbar__link--active" : "navbar__link"
              }
            >
              {label}
              <span className="navbar__link-jp">{jp}</span>
            </NavLink>
          ))}
        </nav>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <nav className={`navbar__mobile ${menuOpen ? "navbar__mobile--open" : ""}`}>
        {navLinks.map(({ to, label, jp }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              isActive
                ? "navbar__mobile-link navbar__mobile-link--active"
                : "navbar__mobile-link"
            }
            onClick={() => setMenuOpen(false)}
          >
            <span className="navbar__mobile-jp">{jp}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}