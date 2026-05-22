import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Kanji.css";

const JLPT_LEVELS = [5, 4, 3, 2, 1];
const BASE_URL = "https://kanjiapi.dev/v1";

export default function Kanji() {
  // ── State ──────────────────────────────────────────────
  const [level, setLevel]           = useState(5);
  const [kanjiList, setKanjiList]   = useState([]);   // array of kanji characters
  const [selected, setSelected]     = useState(null); // detail objek kanji yang dipilih
  const [detail, setDetail]         = useState(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorList, setErrorList]   = useState(null);
  const [errorDetail, setErrorDetail] = useState(null);

  // ── Fetch list kanji berdasarkan level JLPT ────────────
  useEffect(() => {
    setKanjiList([]);
    setSelected(null);
    setDetail(null);
    setErrorList(null);
    setLoadingList(true);

    axios
      .get(`${BASE_URL}/kanji/jlpt-${level}`)
      .then((res) => setKanjiList(res.data))
      .catch(() => setErrorList("Gagal memuat daftar kanji. Coba lagi."))
      .finally(() => setLoadingList(false));
  }, [level]); // re-fetch setiap level berubah

  // ── Fetch detail satu kanji ────────────────────────────
  const handleSelectKanji = (char) => {
    if (selected === char) {
      setSelected(null);
      setDetail(null);
      return;
    }
    setSelected(char);
    setDetail(null);
    setErrorDetail(null);
    setLoadingDetail(true);

    axios
      .get(`${BASE_URL}/kanji/${encodeURIComponent(char)}`)
      .then((res) => setDetail(res.data))
      .catch(() => setErrorDetail("Gagal memuat detail kanji."))
      .finally(() => setLoadingDetail(false));
  };

  const closeDetail = () => {
    setSelected(null);
    setDetail(null);
  };

  // ── Render ─────────────────────────────────────────────
  return (
    <div className="kanji-page">
      {/* Header */}
      <div className="kanji-hero">
        <div className="kanji-hero__deco">漢字</div>
        <h1 className="kanji-hero__title">Daftar Kanji</h1>
        <p className="kanji-hero__sub">
          Pilih level JLPT lalu klik kanji untuk melihat informasi lengkapnya
        </p>

        {/* JLPT Filter */}
        <div className="kanji-filter">
          {JLPT_LEVELS.map((n) => (
            <button
              key={n}
              className={`kanji-filter__btn kanji-filter__btn--n${n} ${level === n ? "active" : ""}`}
              onClick={() => setLevel(n)}
            >
              N{n}
            </button>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div className="kanji-layout">
        {/* Grid kanji */}
        <div className="kanji-grid-wrap">
          {/* Loading list */}
          {loadingList && (
            <div className="kanji-status">
              <div className="kanji-spinner" />
              <span>Memuat kanji N{level}...</span>
            </div>
          )}

          {/* Error list */}
          {errorList && <div className="kanji-error">{errorList}</div>}

          {/* Info jumlah */}
          {!loadingList && !errorList && kanjiList.length > 0 && (
            <p className="kanji-count">
              <span>{kanjiList.length}</span> kanji ditemukan untuk level N{level}
            </p>
          )}

          {/* Grid */}
          <div className="kanji-grid">
            {kanjiList.map((char) => (
              <button
                key={char}
                className={`kanji-card ${selected === char ? "kanji-card--active" : ""}`}
                onClick={() => handleSelectKanji(char)}
                title={char}
              >
                {char}
              </button>
            ))}
          </div>
        </div>

        {/* Panel detail */}
        {selected && (
          <div className="kanji-detail">
            <button className="kanji-detail__close" onClick={closeDetail}>✕</button>

            {loadingDetail && (
              <div className="kanji-status">
                <div className="kanji-spinner" />
                <span>Memuat detail...</span>
              </div>
            )}

            {errorDetail && <div className="kanji-error">{errorDetail}</div>}

            {detail && !loadingDetail && (
              <>
                {/* Karakter besar */}
                <div className="kanji-detail__char">{detail.kanji}</div>

                {/* Badge level */}
                <div className="kanji-detail__badges">
                  {detail.jlpt && (
                    <span className={`kanji-badge kanji-badge--n${detail.jlpt}`}>
                      JLPT N{detail.jlpt}
                    </span>
                  )}
                  {detail.grade && (
                    <span className="kanji-badge kanji-badge--grade">
                      Grade {detail.grade}
                    </span>
                  )}
                  <span className="kanji-badge kanji-badge--stroke">
                    {detail.stroke_count} stroke
                  </span>
                </div>

                {/* Arti */}
                <div className="kanji-detail__section">
                  <h3 className="kanji-detail__label">Arti</h3>
                  <p className="kanji-detail__meanings">
                    {detail.meanings?.join(", ") || "—"}
                  </p>
                </div>

                {/* Bacaan On */}
                <div className="kanji-detail__section">
                  <h3 className="kanji-detail__label">Bacaan On <span>音読み</span></h3>
                  <div className="kanji-detail__readings">
                    {detail.on_readings?.length > 0
                      ? detail.on_readings.map((r) => (
                          <span key={r} className="kanji-reading kanji-reading--on">{r}</span>
                        ))
                      : <span className="kanji-reading__empty">—</span>}
                  </div>
                </div>

                {/* Bacaan Kun */}
                <div className="kanji-detail__section">
                  <h3 className="kanji-detail__label">Bacaan Kun <span>訓読み</span></h3>
                  <div className="kanji-detail__readings">
                    {detail.kun_readings?.length > 0
                      ? detail.kun_readings.map((r) => (
                          <span key={r} className="kanji-reading kanji-reading--kun">{r}</span>
                        ))
                      : <span className="kanji-reading__empty">—</span>}
                  </div>
                </div>

                {/* Name readings */}
                {detail.name_readings?.length > 0 && (
                  <div className="kanji-detail__section">
                    <h3 className="kanji-detail__label">Bacaan Nama <span>名前</span></h3>
                    <div className="kanji-detail__readings">
                      {detail.name_readings.map((r) => (
                        <span key={r} className="kanji-reading kanji-reading--name">{r}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Unicode */}
                <div className="kanji-detail__footer">
                  Unicode: U+{detail.unicode?.toUpperCase()}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
