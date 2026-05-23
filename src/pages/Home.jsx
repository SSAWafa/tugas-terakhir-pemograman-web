import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../styles/home.css"; 

const Home = () => {
  const [kategoriAktif, setKategoriAktif] = useState('materi');
  
  // State untuk tanda centang (disimpan di browser)
  const [selesai, setSelesai] = useState(() => {
    const saved = localStorage.getItem('progresBelajar');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('progresBelajar', JSON.stringify(selesai));
  }, [selesai]);

  const toggleSelesai = (id) => {
    setSelesai(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const ruteLangkah = [
    { id: 'step1', title: "Hiragana & Katakana", desc: "Dasar sistem penulisan Jepang.", path: "/hiragana" },
    { id: 'step2', title: "Grammar & Partikel", desc: "Struktur kalimat dan partikel dasar.", path: "/tata-bahasa" },
    { id: 'step3', title: "Kanji Dasar N5", desc: "Karakter kanji tingkat pemula.", path: "/kanji" },
    { id: 'step4', title: "Kosakata N5", desc: "Kumpulan kata benda & kerja N5.", path: "/kosakata" },
    { id: 'step5', title: "Kalimat N5", desc: "Latihan merangkai kalimat lengkap.", path: "/kalimat" },
    { id: 'step6', title: "Mulai N4", desc: "Lanjut ke tingkat menengah bawah.", path: "/n4" },
  ];

  const daftarKonten = [
    { id: 1, category: 'materi', title: "Mengenal Tingkatan JLPT", path: "/jplt", desc: "Penjelasan tingkatan JPLT." },
    { id: 2, category: 'materi', title: "Hiragana", path: "/hiragana", desc: "Mulai belajar huruf dasar Jepang dari nol." },
    { id: 3, category: 'materi', title: "Katakana", path: "/katakana", desc: "Pelajari huruf untuk penulisan kata serapan asing." },   
    { id: 4, category: 'materi', title: "Grammar dasar Bahasa jepang", path: "/tata-bahasa", desc: "Struktur kalimat dasar dan penggunaan partikel." },
    { id: 5, category: 'materi', title: "Belajar partikel Bahasa jepang", path: "/partikel", desc: "Partikel dasar bahasa Jepang"},
    { id: 6, category: 'materi', title: "Penjelasan awal belajar kanji", path: "/awalkanji", desc: "Persiapan belajar kanji"},
    { id: 7, category: 'materi', title: "Daftar Kanji", path: "/kanji", desc: "Daftar karakter kanji N5-N1."},
    { id: 8, category: 'materi', title: "Flashcard Kanji", path: "/flashcard", desc: "Flashcard karakter kanji N5-N1."},
    { id: 9, category: 'materi', title: "Kuis Kanji", path: "/kuis", desc: "Kuis karakter kanji N5-N1."},
    { id: 10, category: 'blog', title: "Keuntungan Belajar Bahasa Jepang", path: "/benefit", desc: "Kenapa Belajar Bahasa Jepang." },
    { id: 11, category: 'blog', title: "Rekomendasi buku sumber daya belajar Bahasa jepang", path: "/buku", desc: "Daftar buku belajar bahasa Jepang."},
    { id: 12, category: 'blog', title: "Rekomendasi platform online sumber daya belajar", path: "/platform", desc: "Platform belajar bahasa Jepang."},
    { id: 13, category: 'blog', title: "Artikel Budaya Populer di Jepang", path: "/budaya", desc: "Budaya popular dan menarik di Jepang." },
    { id: 14, category: 'info', title: "About Us", path: "/about", desc: "Informasi mengenai anggota kita." },
  ];

  const kontenTersaring = daftarKonten.filter(item => item.category === kategoriAktif);

  return (
    <>
      {/* HERO SECTION */}
      <main className="home-hero">
        <div className="hero__inner">
          <div className="hero__bg-text">日本語</div>
          <div className="hero__content">
            <div className="hero__badge">Panduan Belajar Bahasa Jepang</div>
            <h1 className="hero__title">Belajar Bahasa <br /><span className="hero__title-accent">Jepang.</span></h1>
            <p className="hero__description">Mulai dari Hiragana hingga persiapan JLPT N5-N1 dengan metode yang menyenangkan.</p>
            <div className="hero__actions">
              <a href="#mulai-belajar" className="hero__btn hero__btn--primary">Mulai Belajar <span>→</span></a>
              <a href="#rute-belajar" className="hero__btn hero__btn--secondary">Lihat Rute</a>
            </div>
          </div>
          <div className="hero__visual">
             <div className="hero__card">
               <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80" alt="Hero" className="hero__card-image" />
               <div className="hero__card-overlay"></div>
               <div className="hero__card-content">
                 <span className="hero__card-label">Materi Terpopuler</span>
                 <h3 className="hero__card-title">Cara Cepat Hafal Kanji</h3>
               </div>
             </div>
          </div>
        </div>
      </main>

      {/* SECTION EKSPLORASI */}
      <section id="mulai-belajar" className="home-features">
        <div className="features__header">
          <h2 className="features__title">Mulai Belajar</h2>
        </div>
        <div className="tabs-container">
          <button className={`tab-btn ${kategoriAktif === 'materi' ? 'tab-btn--active' : ''}`} onClick={() => setKategoriAktif('materi')}>Materi Belajar & Latihan</button>
          <button className={`tab-btn ${kategoriAktif === 'blog' ? 'tab-btn--active' : ''}`} onClick={() => setKategoriAktif('blog')}>Blog & Budaya</button>
          <button className={`tab-btn ${kategoriAktif === 'info' ? 'tab-btn--active' : ''}`} onClick={() => setKategoriAktif('info')}>Info</button>
        </div>
        <div className="features__grid">
          {kontenTersaring.map((item) => (
            <div key={item.id} className="feature-card">
              <h3 className="feature-card__title">{item.title}</h3>
              <p className="feature-card__desc">{item.desc}</p>
              <Link to={item.path} className="feature-card__link">Buka Selengkapnya →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* === BAGIAN RUTE BELAJAR (ADD TO BOTTOM) === */}
      <section id="rute-belajar" className="home-roadmap">
        <div className="features__header">
          <h2 className="features__title">Rute Belajar</h2>
          <p className="features__subtitle">Ikuti langkah ini untuk hasil maksimal</p>
        </div>
        <div className="roadmap__list">
          {ruteLangkah.map((step, index) => (
            <div key={step.id} className={`roadmap__item ${selesai.includes(step.id) ? 'is-done' : ''}`}>
              <div className="roadmap__circle">
                {selesai.includes(step.id) ? "✓" : index + 1}
              </div>
              <div className="roadmap__card">
                <div className="roadmap__card-header">
                  <h3>{step.title}</h3>
                  <input 
                    type="checkbox" 
                    checked={selesai.includes(step.id)} 
                    onChange={() => toggleSelesai(step.id)} 
                  />
                </div>
                <p>{step.desc}</p>
                <Link to={step.path} className="roadmap__link">Buka Materi →</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;