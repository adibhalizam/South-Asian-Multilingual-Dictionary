import React, { useState, useEffect } from 'react';
import './styles/Dictionary.css';

const LANGUAGE_MAP = {
  1: 'Urdu',
  2: 'Bengali',
  3: 'Hindi',
  4: 'Punjabi',
  5: 'Tamil',
  6: 'Persian'
};

const DictionaryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mainLanguage, setMainLanguage] = useState('English');
  const [selectedLanguages, setSelectedLanguages] = useState({
    1: 'Urdu',
    2: 'Bengali',
    3: 'Punjabi'
  });
  const [dictionaryData, setDictionaryData] = useState([]);
  const [translations, setTranslations] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [lastSearchedWord, setLastSearchedWord] = useState('');

  // Fetch dictionary data from backend
  useEffect(() => {
    const fetchDictionaryData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/words');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setDictionaryData(data);
      } catch (error) {
        setErrorMessage('Error fetching dictionary data. Please try again later.');
        console.error(error);
      }
    };

    fetchDictionaryData();
  }, []);

  // Update translations based on search term and selected languages
  const handleTranslate = () => {
    // Find the translation across all languages
    const foundWord = dictionaryData.find((item) => {
      // Check if the search term matches English or any translation
      const translations = Object.values(item.translations);
      return item.english_word.toLowerCase() === searchTerm.toLowerCase() ||
             translations.some(
               t => t.translated_word.toLowerCase() === searchTerm.toLowerCase()
             );
    });

    if (foundWord) {
      const newTranslations = {};
      
      // Iterate through selected languages
      Object.keys(selectedLanguages).forEach((boxId) => {
        const selectedLang = selectedLanguages[boxId];
        
        // Find the translation ID for the selected language
        const translationId = Object.keys(LANGUAGE_MAP).find(
          key => LANGUAGE_MAP[key] === selectedLang
        );

        // Get the translation using the translation ID
        const languageTranslation = foundWord.translations[translationId];

        newTranslations[boxId] = languageTranslation || null;
      });

      setTranslations(newTranslations);
      setLastSearchedWord(searchTerm);
      setErrorMessage(Object.values(newTranslations).every(t => t === null) 
        ? 'No translations found for the selected languages.' 
        : '');
    } else {
      setTranslations({});
      setErrorMessage('Word not found. Please try another search.');
    }
  };

  // Handle changes to the search term
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setErrorMessage(''); // Clear any previous error message
  };

  // Handle changes to the main language dropdown
  const handleMainLanguageChange = (e) => {
    setMainLanguage(e.target.value);
  };

  // Handle changes in the translation boxes
  const handleBoxLanguageChange = (boxId, lang) => {
    setSelectedLanguages((prev) => ({ ...prev, [boxId]: lang }));

    // If a word has been previously searched, update the translations
    if (lastSearchedWord) {
      const foundWord = dictionaryData.find((item) => {
        const translations = Object.values(item.translations);
        return item.english_word.toLowerCase() === lastSearchedWord.toLowerCase() ||
               translations.some(
                 t => t.translated_word.toLowerCase() === lastSearchedWord.toLowerCase()
               );
      });

      if (foundWord) {
        const translationId = Object.keys(LANGUAGE_MAP).find(
          key => LANGUAGE_MAP[key] === lang
        );

        const newTranslations = { ...translations };
        newTranslations[boxId] = foundWord.translations[translationId] || null;
        setTranslations(newTranslations);
      }
    }
  };

  // Render translation box content
  const renderTranslationBox = (boxId) => {
    const translation = translations[boxId];
    return translation ? (
      <div className="box-content">
        <div className="content-text">
          <p><strong>Translated Word:</strong> </p> 
          <p> {translation.translated_word}</p>
          <p><strong>Word Class:</strong></p> 
          <p> {translation.word_class}</p>
          <p><strong>Pronunciation:</strong></p> 
          <p> {translation.pronunciation}</p>
          <p><strong>Synonym:</strong></p> 
          <p> {translation.synonym}</p>
          <p><strong>Usage Sentence:</strong></p> 
          <p> {translation.usage_sentence}</p>
        </div>

        {translation.audio_file && translation.audio_file.data && (
          <audio controls className="audio-player">
            <source 
              src={`data:audio/mpeg;base64,${btoa(String.fromCharCode.apply(null, translation.audio_file.data))}`} 
              type="audio/mpeg" 
            />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    ) : (
      <p>No translation available for this language.</p>
    );
  };

  return (
    <div className="dictionary-page">
      <button className="admin-login-btn" onClick={() => window.location.href = 'http://localhost:3001/auth/google'}>Admin Login</button>
      <h1>South Asian Multilingual Dictionary</h1>

      <div className="search-bar-container">
        <select onChange={handleMainLanguageChange} value={mainLanguage}>
          <option value="English">English</option>
          <option value="Bengali">Bengali</option>
          <option value="Urdu">Urdu</option>
          <option value="Punjabi">Punjabi</option>
          <option value="Persian">Persian</option>
          <option value="Hindi">Hindi</option>
          <option value="Tamil">Tamil</option>
        </select>

        <input
          type="text"
          placeholder="Search for a word"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        
        <button onClick={handleTranslate}>Translate</button>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="dictionary-boxes">
        {Object.keys(selectedLanguages).map((boxId) => (
          <div className="dictionary-box" key={boxId}>
            <select
              className="boxTitle"
              onChange={(e) => handleBoxLanguageChange(boxId, e.target.value)}
              value={selectedLanguages[boxId]}
            >
              <option value="Urdu">Urdu</option>
              <option value="Bengali">Bengali</option>
              <option value="Hindi">Hindi</option>
              <option value="Punjabi">Punjabi</option>
              <option value="Persian">Persian</option>
              <option value="Tamil">Tamil</option>
            </select>
            {renderTranslationBox(boxId)}
          </div>
        ))}
      </div>
      
      {translations[1] && (
      <div className="image-container">
        <img 
          src={translations[1].image} 
          alt="Related to the translated word" 
          className="dictionary-large-image"
        />
      </div>
    )}

    </div>
  );
};

export default DictionaryPage;