import React from 'react';
import "../styles/about.css";

const About = () => {
  const team = [
    { name: "Nama Kamu", role: "Frontend Developer", bio: "Mengerjakan Home, About, & Benefit.", jp: "私" },
    { name: "Teman A", role: "UI Designer", bio: "Mengerjakan Grammar & JLPT.", jp: "友" },
    { name: "Teman B", role: "Content Creator", bio: "Mengerjakan Artikel & Resources.", jp: "人" },
    { name: "Teman C", role: "Content Creator", bio: "Mengerjakan Artikel & Resources.", jp: "人" },
    { name: "Teman D", role: "Content Creator", bio: "Mengerjakan Artikel & Resources.", jp: "人" }
  ];

  return (
    <div className="about-section">
      <div className="about__header">
        <h2 className="about__title">Tentang Kelompok Kami</h2>
        <p className="about__subtitle">
          Kami adalah tim yang bersemangat untuk membantu siapa saja belajar bahasa Jepang dengan lebih mudah dan menyenangkan.
        </p>
      </div>

      <div className="about__grid">
        {team.map((member, index) => (
          <div key={index} className="about__card">
            <div className="about__avatar">{member.jp}</div>
            <h3 className="about__name">{member.name}</h3>
            <p className="about__role">{member.role}</p>
            <p className="about__bio">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;