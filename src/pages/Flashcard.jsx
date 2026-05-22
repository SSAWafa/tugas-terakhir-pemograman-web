import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Flashcard.css";

const JLPT_LEVELS = [5, 4, 3, 2, 1];
const BASE_URL = "https://kanjiapi.dev/v1";

const shuffleArray = (arr) => {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function Flashcard() {
  const [level, setLevel] = useState(5);
  const [kanjiList, setKanjiList] = useState([]);
  const [sessionCards, setSessionCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const [knownList, setKnownList] = useState([]);
  const [unknownList, setUnknownList] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorList, setErrorList] = useState(null);

  const [detailsCache, setDetailsCache] = useState({});

  // Fetch Kanji list on level change
  useEffect(() => {
    setLoadingList(true);
    setErrorList(null);
    setKanjiList([]);
    setSessionCards([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownList([]);
    setUnknownList([]);
    setIsFinished(false);

    axios
      .get(`${BASE_URL}/kanji/jlpt-${level}`)
      .then((res) => {
        const allKanji = res.data;
        setKanjiList(allKanji);
        if (allKanji.length > 0) {
          const shuffled = shuffleArray(allKanji);
          setSessionCards(shuffled.slice(0, 10));
        }
      })
      .catch((err) => {
        console.error("Gagal memuat daftar kanji:", err);
        setErrorList("Gagal memuat daftar kanji. Silakan coba lagi.");
      })
      .finally(() => {
        setLoadingList(false);
      });
  }, [level]);

  // Fetch current card detail
  useEffect(() => {
    if (sessionCards.length === 0 || currentIndex >= sessionCards.length) return;
    const char = sessionCards[currentIndex];

    if (detailsCache[char]) return;

    setLoadingDetail(true);
    axios
      .get(`${BASE_URL}/kanji/${encodeURIComponent(char)}`)
      .then((res) => {
        setDetailsCache((prev) => ({ ...prev, [char]: res.data }));
      })
      .catch((err) => {
        console.error("Gagal memuat detail kanji:", err);
      })
      .finally(() => {
        setLoadingDetail(false);
      });
  }, [currentIndex, sessionCards, detailsCache]);

  // Prefetch next card detail
  useEffect(() => {
    if (sessionCards.length === 0) return;
    const nextIndex = currentIndex + 1;
    if (nextIndex < sessionCards.length) {
      const nextChar = sessionCards[nextIndex];
      if (detailsCache[nextChar]) return;

      axios
        .get(`${BASE_URL}/kanji/${encodeURIComponent(nextChar)}`)
        .then((res) => {
          setDetailsCache((prev) => ({ ...prev, [nextChar]: res.data }));
        })
        .catch(() => {});
    }
  }, [currentIndex, sessionCards, detailsCache]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
      }, 200);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < sessionCards.length) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 200);
    } else {
      setIsFinished(true);
    }
  };

  const handleVerdict = (known) => {
    const char = sessionCards[currentIndex];
    if (known) {
      setKnownList((prev) => [...prev.filter((c) => c !== char), char]);
      setUnknownList((prev) => prev.filter((c) => c !== char));
    } else {
      setUnknownList((prev) => [...prev.filter((c) => c !== char), char]);
      setKnownList((prev) => prev.filter((c) => c !== char));
    }

    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex + 1 < sessionCards.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsFinished(true);
      }
    }, 200);
  };

  const handleRestart = () => {
    if (kanjiList.length > 0) {
      const shuffled = shuffleArray(kanjiList);
      setSessionCards(shuffled.slice(0, 10));
      setCurrentIndex(0);
      setIsFlipped(false);
      setKnownList([]);
      setUnknownList([]);
      setIsFinished(false);
    }
  };

  const handleShuffleSession = () => {
    if (sessionCards.length > 0) {
      setSessionCards(shuffleArray(sessionCards));
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFinished || sessionCards.length === 0) return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === "1" || e.code === "Digit1") {
        if (isFlipped) {
          handleVerdict(false);
        }
      } else if (e.key === "2" || e.code === "Digit2") {
        if (isFlipped) {
          handleVerdict(true);
        }
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFlipped, currentIndex, sessionCards, isFinished]);

  const currentKanji = sessionCards[currentIndex];
  const currentDetail = detailsCache[currentKanji];

  return (
    <div className="fc-page">
      {/* Hero Header */}
      <div className="fc-hero">
        <div className="fc-hero__deco">暗記</div>
        <h1 className="fc-hero__title">Flashcard Kanji</h1>
        <p className="fc-hero__sub">
          Tingkatkan hafalan Kanji Jepang Anda dengan metode Flashcard interaktif
        </p>

        {/* JLPT Filter */}
        <div className="fc-filter">
          {JLPT_LEVELS.map((n) => (
            <button
              key={n}
              className={`fc-filter__btn fc-filter__btn--n${n} ${level === n ? "active" : ""}`}
              onClick={() => setLevel(n)}
            >
              N{n}
            </button>
          ))}
        </div>
      </div>

      {/* Main Study Zone */}
      <div className="fc-main">
        {loadingList ? (
          <div className="fc-status">
            <div className="fc-spinner fc-spinner--lg" />
            <span>Memuat daftar kanji JLPT N{level}...</span>
          </div>
        ) : errorList ? (
          <div className="fc-status">{errorList}</div>
        ) : isFinished ? (
          <div className="fc-done">
            <div className="fc-done__emoji">🎉</div>
            <h2>Sesi Belajar Selesai!</h2>
            <div className="fc-done__stats">
              <div className="fc-done__stat fc-done__stat--known">
                <span className="fc-done__stat-num">{knownList.length}</span>
                <span>Hapal</span>
              </div>
              <div className="fc-done__stat fc-done__stat--unknown">
                <span className="fc-done__stat-num">{unknownList.length}</span>
                <span>Belum Hapal</span>
              </div>
            </div>
            <div className="fc-done__actions">
              <button className="fc-action-btn fc-action-btn--primary" onClick={handleRestart}>
                Ulangi Sesi Ini
              </button>
              <button
                className="fc-action-btn fc-action-btn--secondary"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Pilih Level Lain
              </button>
            </div>
          </div>
        ) : sessionCards.length > 0 ? (
          <>
            {/* Progress Bar */}
            <div className="fc-progress-wrap">
              <div className="fc-progress-bar">
                <div
                  className="fc-progress-fill"
                  style={{ width: `${(currentIndex / sessionCards.length) * 100}%` }}
                />
              </div>
              <div className="fc-progress-meta">
                <span>
                  Progres: <strong>{currentIndex + 1}</strong> <small>/ {sessionCards.length}</small>
                </span>
                <div className="fc-progress-tags">
                  <span className="fc-tag fc-tag--known">Hapal: {knownList.length}</span>
                  <span className="fc-tag fc-tag--unknown">Belum: {unknownList.length}</span>
                </div>
              </div>
            </div>

            {/* Flashcard (3D Flip) */}
            <div className="fc-card-scene" onClick={() => setIsFlipped(!isFlipped)}>
              <div className={`fc-card ${isFlipped ? "fc-card--flipped" : ""}`}>
                {/* Front Side */}
                <div className="fc-card__face fc-card__front">
                  <span className="fc-card__level-badge">JLPT N{level}</span>
                  <div className="fc-card__char">{currentKanji}</div>
                  <span className="fc-card__hint">Klik kartu atau tekan Spasi untuk melihat arti</span>
                </div>

                {/* Back Side */}
                <div className="fc-card__face fc-card__back">
                  {loadingDetail || !currentDetail ? (
                    <div className="fc-status">
                      <div className="fc-spinner" style={{ borderTopColor: "#fff" }} />
                      <span style={{ color: "#fff" }}>Memuat detail...</span>
                    </div>
                  ) : (
                    <>
                      <span className="fc-card__level-badge">JLPT N{level}</span>
                      <div className="fc-card__char fc-card__char--sm">{currentDetail.kanji}</div>
                      <div className="fc-card__meanings">
                        {currentDetail.meanings?.join(", ") || "—"}
                      </div>
                      <div className="fc-card__divider" />
                      <div className="fc-card__readings">
                        <div className="fc-card__reading-row">
                          <span className="fc-card__reading-label">音</span>
                          <span className="fc-card__reading-val fc-card__reading-val--on">
                            {currentDetail.on_readings?.join(", ") || "—"}
                          </span>
                        </div>
                        <div className="fc-card__reading-row">
                          <span className="fc-card__reading-label">訓</span>
                          <span className="fc-card__reading-val fc-card__reading-val--kun">
                            {currentDetail.kun_readings?.join(", ") || "—"}
                          </span>
                        </div>
                      </div>
                      <div className="fc-card__stroke">
                        {currentDetail.stroke_count} stroke
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="fc-controls">
              <button
                className="fc-nav-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                disabled={currentIndex === 0}
                title="Sebelumnya (←)"
              >
                ←
              </button>

              <div className="fc-verdict-btns" onClick={(e) => e.stopPropagation()}>
                {isFlipped ? (
                  <>
                    <button
                      className="fc-verdict fc-verdict--unknown"
                      onClick={() => handleVerdict(false)}
                      title="Belum Hapal (Tekan 1)"
                    >
                      <span>Belum Hapal</span>
                      <small>Tekan 1</small>
                    </button>
                    <button
                      className="fc-verdict fc-verdict--known"
                      onClick={() => handleVerdict(true)}
                      title="Hapal (Tekan 2)"
                    >
                      <span>Hapal</span>
                      <small>Tekan 2</small>
                    </button>
                  </>
                ) : (
                  <button className="fc-flip-btn" onClick={() => setIsFlipped(true)}>
                    Buka Arti
                  </button>
                )}
              </div>

              <button
                className="fc-nav-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                title="Selanjutnya (→)"
              >
                →
              </button>
            </div>

            {/* Shuffle Button */}
            <button
              className="fc-shuffle-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleShuffleSession();
              }}
            >
              🔄 Acak Urutan Kartu Sesi
            </button>
          </>
        ) : (
          <div className="fc-status">Tidak ada kanji yang ditemukan untuk level ini.</div>
        )}
      </div>
    </div>
  );
}
