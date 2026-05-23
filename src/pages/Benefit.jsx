import React from 'react';
import '../styles/benefit.css'; // Pastikan path file CSS sesuai

const Benefit = () => {
  const manfaatList = [
    {
      no: "01",
      title: "Peluang Karier Global yang Luas",
      desc: "Jepang adalah salah satu kekuatan ekonomi terbesar di dunia. Banyak perusahaan besar Jepang beroperasi di Indonesia dan di seluruh dunia. Menguasai bahasa mereka membuka kesempatan emas untuk bekerja di perusahaan multinasional atau bahkan berkarier langsung di Jepang."
    },
    {
      no: "02",
      title: "Pendidikan Berkualitas dan Beasiswa",
      desc: "Jepang terkenal dengan universitas top dunia dan inovasi teknologinya. Dengan bisa bahasa Jepang, peluang kamu untuk mendapatkan beasiswa bergengsi seperti MEXT (Monbukagakusho) atau beasiswa dari pihak swasta lainnya akan terbuka jauh lebih lebar."
    },
    {
      no: "03",
      title: "Memahami Budaya Populer Lebih Mendalam",
      desc: "Apakah kamu suka Anime, Manga, J-Pop, atau Game? Mengetahui bahasa Jepang membuat kamu bisa menikmati karya-karya tersebut langsung dari bahasa aslinya tanpa perlu bergantung pada subtitle atau terjemahan yang kadang kurang akurat."
    },
    {
      no: "04",
      title: "Melatih Otak dan Daya Ingat",
      desc: "Belajar sistem penulisan Jepang (Hiragana, Katakana, dan Kanji) terbukti secara ilmiah dapat meningkatkan fungsi kognitif otak. Proses ini melatih cara berpikir visual sekaligus mengasah ingatan kamu menjadi lebih tajam."
    },
    {
      no: "05",
      title: "Kemudahan Saat Berwisata",
      desc: "Jepang adalah salah satu destinasi wisata paling dicari. Dengan memahami percakapan dasar, perjalanan kamu di sana akan jauh lebih bermakna. Kamu bisa berinteraksi langsung dengan warga lokal, memesan makanan otentik, dan menjelajahi tempat tersembunyi dengan mudah."
    }
  ];

  return (
    <div className="benefit-page">
      {/* Hero Banner Bagian Atas */}
      <div className="benefit-hero">
        <div className="benefit-hero__container">
          <span className="benefit__tag">Artikel & Edukasi</span>
          <h1 className="benefit__main-title">
            Ketahui Manfaat dan Alasan Pentingnya <br />
            <span className="benefit__title-highlight">Belajar Bahasa Jepang</span>
          </h1>
          <p className="benefit__meta">Oleh Tim NihonGo! • Waktu baca: 4 menit</p>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="benefit-content__wrapper">
        <main className="benefit-main__content">
          {/* Gambar Ilustrasi Utama */}
          <div className="benefit__featured-image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80" 
              alt="Budaya dan Teknologi Jepang" 
              className="benefit__featured-image"
            />
          </div>

          {/* Paragraf Pembuka */}
          <section className="benefit__intro-text">
            <p>
              Di era globalisasi saat ini, menguasai bahasa asing merupakan nilai tambah yang sangat krusial. Selain bahasa Inggris, bahasa Jepang kini menjadi salah satu bahasa yang paling diminati oleh banyak orang di Indonesia, baik mahasiswa maupun profesional.
            </p>
            <p>
              Tidak hanya sekadar tren hobi, mempelajari bahasa dari negeri matahari terbit ini menyimpan segudang manfaat jangka panjang untuk masa depan Anda. Mari kita bedah satu per satu alasan mengapa investasi waktu untuk belajar bahasa Jepang sangatlah berharga.
            </p>
          </section>

          {/* List Manfaat Utama */}
          <section className="benefit__list-section">
            <h2 className="benefit__section-title">Alasan Utama Mengapa Harus Belajar Bahasa Jepang</h2>
            
            <div className="benefit__grid">
              {manfaatList.map((item, index) => (
                <div className="benefit__card" key={index}>
                  <div className="benefit__card-number">{item.no}</div>
                  <div className="benefit__card-body">
                    <h3 className="benefit__card-title">{item.title}</h3>
                    <p className="benefit__card-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Kesimpulan / Penutup */}
          <section className="benefit__summary-box">
            <h3>Kesimpulan</h3>
            <p>
              Belajar bahasa Jepang bukan hanya soal menghafal huruf dan kosakata, melainkan membuka pintu gerbang menuju dunia baru yang penuh dengan peluang karier, pendidikan, dan pengalaman budaya yang kaya. Langkah awal memang terasa menantang, namun hasil yang akan kamu tuai di masa depan sangat sebanding dengan kerja kerasmu saat ini. Jadi, tunggu apa lagi? Mulai petualangan belajarmu sekarang!
            </p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Benefit;