import React, { useState } from 'react';
import './styles/Dictionary.css';


const DictionaryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState('English');
  const [boxes, setBoxes] = useState({ 1: 'Bengali', 2: 'Urdu', 3: 'Punjabi' });

  // Example data (you can replace this with actual data or an API)
  const dictionaryData = {
    Bengali: {
      translated_word: 'স্বাস্থ্য',
      wordClass: 'Noun',
      pronunciation: 'Shwasthyo',
      synonym: 'well-being',
      usage_sentence: 'স্বাস্থ্য আমাদের সবচেয়ে গুরুত্বপূর্ণ সম্পদ।',
      audio: 'audio_url_here'
    },
    Urdu: {
      translated_word: 'صحت',
      wordClass: 'Noun',
      pronunciation: 'Sehat',
      synonym: 'health',
      usage_sentence: 'صحت سب سے بڑا تحفہ ہے۔',
      audio: 'audio_url_here'
    },
    Punjabi: {
      translated_word: 'ਸਿਹਤ',
      wordClass: 'Noun',
      pronunciation: 'Sehat',
      synonym: 'health',
      usage_sentence: 'ਸਿਹਤ ਸਭ ਤੋਂ ਵੱਡਾ ਤੋਹਫਾ ਹੈ।',
      audio: 'audio_url_here'
    },
    Persian: {
      translated_word: 'سلامتی',
      wordClass: 'Noun',
      pronunciation: 'Salamati',
      synonym: 'well-being',
      usage_sentence: 'سلامتی بزرگترین دارایی است.',
      audio: 'audio_url_here'
    },
    Hindi: {
      translated_word: 'स्वास्थ्य',
      wordClass: 'Noun',
      pronunciation: 'Swasthya',
      synonym: 'health',
      usage_sentence: 'स्वास्थ्य सबसे बड़ी संपत्ति है।',
      audio: 'audio_url_here'
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleSearch = () => {
  console.log("Search clicked for:", searchTerm);
  // Add your search functionality here
};


  const handleBoxLanguageChange = (box, lang) => {
    setBoxes(prevState => ({
      ...prevState,
      [box]: lang
    }));
  };

  return (
    <div className="dictionary-page">
      {/* Admin Login Button */}
      <button className="admin-login-btn">Admin Login</button>

      <h1>Dictionary</h1>
      
      <div className="search-bar-container">

        <select onChange={handleLanguageChange} value={language}>
          <option value="English">English</option>
          <option value="Bengali">Bengali</option>
          <option value="Urdu">Urdu</option>
          <option value="Punjabi">Punjabi</option>
          <option value="Persian">Persian</option>
          <option value="Hindi">Hindi</option>
        </select>

        <input
          type="text"
          placeholder="Search for a word"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        
        <svg onClick={handleSearch} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-search clickable">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
          <path d="M21 21l-6 -6" />
        </svg>
        
      </div>

      <div className="dictionary-boxes">
        {Object.keys(boxes).map((boxNum) => (
          <div className="dictionary-box" key={boxNum}>
            <div className="box-header">
              <h2>
                <select
                  onChange={(e) => handleBoxLanguageChange(boxNum, e.target.value)}
                  value={boxes[boxNum]}
                  className="language-selector"
                >
                  <option value="Bengali">Bengali</option>
                  <option value="Urdu">Urdu</option>
                  <option value="Punjabi">Punjabi</option>
                  <option value="Persian">Persian</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </h2>
            </div>
            <div className="box-content">
              <div className="content-text">
    <p><strong>Translated Word:</strong></p>
    <p>{dictionaryData[boxes[boxNum]]?.translated_word}</p>
    <p><strong>Word Class:</strong></p>
    <p>{dictionaryData[boxes[boxNum]]?.wordClass}</p>
    <p><strong>Pronunciation:</strong></p>
    <p>{dictionaryData[boxes[boxNum]]?.pronunciation}</p>
    <p><strong>Synonym:</strong></p>
    <p>{dictionaryData[boxes[boxNum]]?.synonym}</p>
    <p><strong>Usage Sentence:</strong></p>
    <p>{dictionaryData[boxes[boxNum]]?.usage_sentence}</p>
  </div>
  <audio controls className="audio-player">
    <source src={dictionaryData[boxes[boxNum]]?.audio} type="audio/mpeg" />
    Your browser does not support the audio element.
  </audio>
            </div>
          </div>
        ))}
      </div>

      {/* Image Display Below the Boxes */}
      <div className="image-container">
        <img src={dictionaryData[language]?.image} alt="Dictionary Image" />
      </div>
    </div>
  );
};

export default DictionaryPage;

