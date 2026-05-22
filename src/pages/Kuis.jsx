import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Kuis.css";

const BASE_URL = "https://kanjiapi.dev/v1";

const shuffleArray = (arr) => {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function Kuis() {
  // ── State Pengaturan Kuis (Form) ─────────────────────────
  const [level, setLevel] = useState(5);
  const [questionCount, setQuestionCount] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [questionType, setQuestionType] = useState("random"); // random, meaning, reading

  // ── State Status Kuis ───────────────────────────────────
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ── State Jawaban & Skor ───────────────────────────────
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  // ── State Informasi Kanji untuk Opsional Latar Belakang ──
  const [detailsCache, setDetailsCache] = useState({});

  // ── Memulai Kuis & Ambil Data dari API ───────────────────
  const handleStartQuiz = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setUserAnswers([]);
    setIsFinished(false);

    try {
      // 1. Ambil daftar kanji berdasarkan level JLPT (Minimal 10 item)
      const listResponse = await axios.get(`${BASE_URL}/kanji/jlpt-${level}`);
      const allKanji = listResponse.data;

      if (!allKanji || allKanji.length === 0) {
        throw new Error("Daftar kanji kosong.");
      }

      // Acak daftar kanji secara keseluruhan
      const shuffledList = shuffleArray(allKanji);
      const selectedKanjiDetails = [];

      // 2. Ambil detail kanji (Axios parallel request)
      // Jika menggunakan filter pencarian (search keyword)
      if (searchKeyword.trim() !== "") {
        const keywordLower = searchKeyword.toLowerCase();
        let checkedCount = 0;
        const batchSize = 15; // Cek bertahap agar tidak membebani API

        while (selectedKanjiDetails.length < questionCount && checkedCount < shuffledList.length) {
          const batch = shuffledList.slice(checkedCount, checkedCount + batchSize);
          checkedCount += batchSize;

          const batchPromises = batch.map((char) =>
            axios.get(`${BASE_URL}/kanji/${encodeURIComponent(char)}`).catch(() => null)
          );

          const batchResults = await Promise.all(batchPromises);
          
          for (const res of batchResults) {
            if (res && res.data) {
              const detail = res.data;
              const meanings = detail.meanings?.map(m => m.toLowerCase()) || [];
              const matchesKeyword = meanings.some(m => m.includes(keywordLower));

              if (matchesKeyword) {
                selectedKanjiDetails.push(detail);
                if (selectedKanjiDetails.length >= questionCount) break;
              }
            }
          }

          if (checkedCount >= 100) break; // Batasi pencarian hingga 100 kanji saja agar cepat
        }

        if (selectedKanjiDetails.length < 5) {
          throw new Error(
            `Hanya ditemukan ${selectedKanjiDetails.length} kanji yang cocok dengan arti "${searchKeyword}". Silakan ganti kata pencarian atau pilih level lain.`
          );
        }
      } else {
        // Jika tidak ada kata pencarian, langsung ambil questionCount kanji pertama
        const targetKanji = shuffledList.slice(0, questionCount);
        
        // Melakukan axios parallel request untuk memuat minimal 10 item sekaligus
        const detailPromises = targetKanji.map((char) =>
          axios.get(`${BASE_URL}/kanji/${encodeURIComponent(char)}`)
        );
        
        const results = await Promise.all(detailPromises);
        results.forEach((res) => {
          if (res.data) {
            selectedKanjiDetails.push(res.data);
          }
        });
      }

      // Simpan kanji terpilih ke cache agar bisa digunakan kembali
      const newCache = { ...detailsCache };
      selectedKanjiDetails.forEach((detail) => {
        newCache[detail.kanji] = detail;
      });
      setDetailsCache(newCache);

      // 3. Konstruksi Soal Pilihan Ganda (4 Pilihan)
      const generatedQuestions = selectedKanjiDetails.map((detail, idx) => {
        // Tentukan tipe soal
        let type = questionType;
        if (type === "random") {
          type = Math.random() > 0.5 ? "meaning" : "reading";
        }

        let questionText = "";
        let correctAnswer = "";
        let wrongPool = [];

        if (type === "meaning") {
          questionText = `Apa arti utama dari kanji '${detail.kanji}'?`;
          correctAnswer = detail.meanings?.[0] || "—";
          // Kumpulkan arti kanji lain sebagai pengecoh
          wrongPool = selectedKanjiDetails
            .filter((_, oIdx) => oIdx !== idx)
            .map((d) => d.meanings?.[0])
            .filter(Boolean);
        } else {
          // Soal bacaan
          const hasKun = detail.kun_readings?.length > 0;
          const hasOn = detail.on_readings?.length > 0;
          
          if (hasOn && (!hasKun || Math.random() > 0.5)) {
            questionText = `Bagaimana bacaan Onyomi (音読み) dari kanji '${detail.kanji}'?`;
            correctAnswer = detail.on_readings?.[0] || "—";
            wrongPool = selectedKanjiDetails
              .filter((_, oIdx) => oIdx !== idx)
              .map((d) => d.on_readings?.[0])
              .filter(Boolean);
          } else {
            questionText = `Bagaimana bacaan Kunyomi (訓読み) dari kanji '${detail.kanji}'?`;
            correctAnswer = detail.kun_readings?.[0] || "—";
            wrongPool = selectedKanjiDetails
              .filter((_, oIdx) => oIdx !== idx)
              .map((d) => d.kun_readings?.[0])
              .filter(Boolean);
          }
        }

        // Ambil 3 pilihan salah secara acak dan buang duplikat
        const uniqueWrong = Array.from(new Set(wrongPool)).filter(w => w !== correctAnswer);
        const shuffledWrong = shuffleArray(uniqueWrong).slice(0, 3);

        // Jika salah pool kurang dari 3, tambahkan jawaban dummy yang logis
        while (shuffledWrong.length < 3) {
          shuffledWrong.push(type === "meaning" ? "Learning" : "なか");
        }

        // Gabungkan jawaban benar dengan 3 salah lalu acak kembali
        const options = shuffleArray([correctAnswer, ...shuffledWrong]);

        return {
          char: detail.kanji,
          type,
          questionText,
          correctAnswer,
          options,
          detail,
        };
      });

      setQuestions(generatedQuestions);
      setIsStarted(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal memuat kuis. Pastikan koneksi internet stabil.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Penanganan Klik Jawaban ─────────────────────────────
  const handleSelectOption = (option) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === questions[currentIndex].correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setUserAnswers((prev) => [
      ...prev,
      {
        question: questions[currentIndex],
        selected: option,
        correct: questions[currentIndex].correctAnswer,
        isCorrect,
      },
    ]);
  };

  // ── Lanjut ke Soal Berikutnya / Selesai ───────────────────
  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setIsStarted(false);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setUserAnswers([]);
    setIsFinished(false);
    setError(null);
  };

  const activeQuestion = questions[currentIndex];

  return (
    <div className="kuis-page">
      {/* ── Header / Hero ── */}
      <header className="kuis-hero">
        <div className="kuis-hero__deco">クイズ</div>
        <h1 className="kuis-hero__title">Kuis Kanji</h1>
        <p className="kuis-hero__sub">
          Uji pemahaman Anda tentang Arti, Onyomi, dan Kunyomi Kanji Jepang
        </p>
      </header>

      {/* ── Main content area ── */}
      <main className="kuis-main">
        {/* Conditional Rendering 1: Spinner Loading */}
        {isLoading && (
          <div className="kuis-card">
            <div className="kuis-status">
              <div className="kuis-spinner" />
              <span>Membuat kuis interaktif JLPT N{level}...<br />Mengambil detail minimal 10 kanji dari API.</span>
            </div>
          </div>
        )}

        {/* Conditional Rendering 2: Pesan Error */}
        {error && !isLoading && (
          <div className="kuis-card">
            <div className="kuis-error">
              <strong>Error:</strong> {error}
            </div>
            <div className="kuis-actions" style={{ justifyContent: "center", marginTop: "16px" }}>
              <button className="kuis-btn kuis-btn--primary" onClick={handleResetQuiz}>
                Kembali ke Pengaturan
              </button>
            </div>
          </div>
        )}

        {/* Conditional Rendering 3: Form Pengaturan Kuis (Sebelum Mulai) */}
        {!isStarted && !isLoading && !error && (
          <div className="kuis-card">
            <h2 className="kuis-card__title">⚙️ Pengaturan Kuis</h2>
            
            {/* Form pencarian/filter menggunakan tag <form> */}
            <form onSubmit={handleStartQuiz} className="kuis-form">
              
              {/* JLPT Level (Menggunakan custom <input type="radio">) */}
              <div className="kuis-form-group">
                <span className="kuis-form-label">Level JLPT</span>
                <div className="kuis-radio-grid">
                  {[5, 4, 3, 2, 1].map((n) => (
                    <label key={n} className="kuis-radio-label">
                      <input
                        type="radio"
                        name="level"
                        className="kuis-radio-input"
                        checked={level === n}
                        onChange={() => setLevel(n)}
                      />
                      <span className="kuis-radio-btn">N{n}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Form Input Keyword / Filter Kanji (input type="text") */}
              <div className="kuis-form-group">
                <label className="kuis-form-label" htmlFor="search-keyword">
                  Filter Arti Kanji (Pencarian Kata Kunci - Bahasa Inggris)
                </label>
                <input
                  id="search-keyword"
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Misal: water, fire, person, tree..."
                  className="kuis-input-text"
                />
              </div>

              {/* Tipe Soal Kuis (Select Input) */}
              <div className="kuis-form-group">
                <label className="kuis-form-label" htmlFor="question-type">
                  Fokus Pertanyaan
                </label>
                <select
                  id="question-type"
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="kuis-select"
                >
                  <option value="random">Acak (Arti & Bacaan)</option>
                  <option value="meaning">Hanya Arti Kanji (Meanings)</option>
                  <option value="reading">Hanya Bacaan Kanji (Readings)</option>
                </select>
              </div>

              {/* Jumlah Soal (input type="number") */}
              <div className="kuis-form-group">
                <label className="kuis-form-label" htmlFor="question-count">
                  Jumlah Pertanyaan (Minimal 5, Maksimal 15)
                </label>
                <input
                  id="question-count"
                  type="number"
                  min="5"
                  max="15"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="kuis-input-number"
                />
              </div>

              <div className="kuis-actions">
                <button type="submit" className="kuis-btn kuis-btn--primary">
                  🏁 Mulai Kuis Kanji
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Conditional Rendering 4: Sesi Kuis Berlangsung */}
        {isStarted && !isFinished && !isLoading && !error && activeQuestion && (
          <>
            {/* Progress Bar */}
            <div className="kuis-progress-wrap">
              <div className="kuis-progress-bar">
                <div
                  className="kuis-progress-fill"
                  style={{ width: `${(currentIndex / questions.length) * 100}%` }}
                />
              </div>
              <div className="kuis-progress-meta">
                <span>
                  Soal ke-<strong>{currentIndex + 1}</strong> dari <strong>{questions.length}</strong>
                </span>
                <span>Skor saat ini: {score}</span>
              </div>
            </div>

            {/* Kartu Pertanyaan */}
            <div className="kuis-card">
              <div className="kuis-question">
                <span className="kuis-question__type">
                  {activeQuestion.type === "meaning" ? "Arti Kanji" : "Cara Baca Kanji"}
                </span>
                <div className="kuis-question__char">{activeQuestion.char}</div>
                <h3 className="kuis-question__text">{activeQuestion.questionText}</h3>
              </div>

              {/* Grid Pilihan Ganda */}
              <div className="kuis-options-grid">
                {activeQuestion.options.map((option, idx) => {
                  let btnClass = "kuis-option-btn";
                  
                  if (isAnswered) {
                    if (option === activeQuestion.correctAnswer) {
                      btnClass += " kuis-option-btn--correct";
                    } else if (option === selectedOption) {
                      btnClass += " kuis-option-btn--incorrect";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      className={btnClass}
                      onClick={() => handleSelectOption(option)}
                      disabled={isAnswered}
                    >
                      <span>{option}</span>
                      {isAnswered && option === activeQuestion.correctAnswer && (
                        <span>✓</span>
                      )}
                      {isAnswered && option === selectedOption && option !== activeQuestion.correctAnswer && (
                        <span>✕</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Jawaban */}
              {isAnswered && (
                <div
                  className={`kuis-feedback ${
                    selectedOption === activeQuestion.correctAnswer
                      ? "kuis-feedback--correct"
                      : "kuis-feedback--incorrect"
                  }`}
                >
                  <span className="kuis-feedback__title">
                    {selectedOption === activeQuestion.correctAnswer
                      ? "🎉 Jawaban Benar!"
                      : `✕ Jawaban Salah!`}
                  </span>
                  <span className="kuis-feedback__desc">
                    Kanji <strong>{activeQuestion.char}</strong> memiliki arti utama: <strong>{activeQuestion.detail.meanings?.join(", ")}</strong>.
                    <br />
                    Bacaan Kunyomi: <strong>{activeQuestion.detail.kun_readings?.join(", ") || "—"}</strong>
                    <br />
                    Bacaan Onyomi: <strong>{activeQuestion.detail.on_readings?.join(", ") || "—"}</strong>
                  </span>
                </div>
              )}

              {/* Tombol Selanjutnya */}
              {isAnswered && (
                <div className="kuis-actions">
                  <button className="kuis-btn kuis-btn--primary" onClick={handleNextQuestion}>
                    {currentIndex + 1 < questions.length ? "Lanjut Soal Berikutnya →" : "Lihat Hasil Kuis 🏆"}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Conditional Rendering 5: Layar Hasil Akhir */}
        {isFinished && (
          <div className="kuis-card kuis-done">
            <div className="kuis-done__emoji">🏆</div>
            <h2>Hasil Kuis Selesai!</h2>
            <p className="kuis-done__sub">Selamat atas usaha keras Anda menyelesaikan kuis!</p>

            <div className="kuis-done__score-box">
              <div className="kuis-done__score-val">
                {Math.round((score / questions.length) * 100)}
              </div>
              <div className="kuis-done__score-label">Skor Akhir</div>
            </div>

            <div className="kuis-done__stats">
              <div className="kuis-done__stat">
                <span className="kuis-done__stat-val">{questions.length}</span>
                <span className="kuis-done__stat-label">Total Soal</span>
              </div>
              <div className="kuis-done__stat kuis-done__stat--correct">
                <span className="kuis-done__stat-val">{score}</span>
                <span className="kuis-done__stat-label">Benar</span>
              </div>
              <div className="kuis-done__stat kuis-done__stat--incorrect">
                <span className="kuis-done__stat-val">{questions.length - score}</span>
                <span className="kuis-done__stat-label">Salah</span>
              </div>
            </div>

            <div className="kuis-done__actions">
              <button className="kuis-btn kuis-btn--secondary" onClick={handleResetQuiz}>
                🔄 Kuis Baru
              </button>
              <button
                className="kuis-btn kuis-btn--primary"
                onClick={handleStartQuiz} // Mulai ulang dengan pengaturan yang sama
              >
                🔁 Ulangi Kuis Ini
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
