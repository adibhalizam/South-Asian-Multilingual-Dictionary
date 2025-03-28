import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/Dictionary.css';

const LANGUAGE_MAP = {
  1: 'Urdu',
  2: 'Bengali',
  3: 'Hindi',
  4: 'Punjabi',
  5: 'Tamil',
  6: 'Persian'
};

const Dictionary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mainLanguage, setMainLanguage] = useState('English');
  const [selectedLanguages, setSelectedLanguages] = useState({
    1: 'Urdu',
    2: 'Bengali',
    3: 'Punjabi'
  });
  const [dictionaryData, setDictionaryData] = useState([]);
  const [wordId, setCurrentWordId] = useState(null);
  const [translations, setTranslations] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [lastSearchedWord, setLastSearchedWord] = useState('');
  const [imageError, setImageError] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [hasImage, setHasImage] = useState(false);

  const navigate = useNavigate();

  const handleNavigateToHelp = () => {
    navigate('/help'); 
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const isLoggingOut = urlParams.get('logout') === 'true';
    
    if (error === 'unauthorized') {
      setErrorMessage('You do not have permission to access the admin area.');
      return;
    }
    
    // Skip auth check if logging out
    if (isLoggingOut) return;
    
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/auth/session', {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (data.authenticated) {
          window.location.href = '/content';
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };
  
    checkAuth();
  }, []);

  // Fetch dictionary data from backend
  useEffect(() => {
    const fetchDictionaryData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/content/words');
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

  const handleTranslate = () => {
    setImageError(false);
    setHasImage(false);

    // Find the translation across selected language and English
    const foundWord = dictionaryData.find((item) => {
      // If main language is English, search in English words
      if (mainLanguage === 'English') {
        return item.english_word.toLowerCase() === searchTerm.toLowerCase();
      }
      
      // Find translation ID for the main language
      const mainLanguageId = Object.keys(LANGUAGE_MAP).find(
        key => LANGUAGE_MAP[key] === mainLanguage
      );
      
      // Check if search term matches the translation in the main language
      const translations = item.translations;
      const mainLanguageTranslation = translations[mainLanguageId];
      
      return mainLanguageTranslation && 
             mainLanguageTranslation.translated_word.toLowerCase() === searchTerm.toLowerCase();
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
      setCurrentWordId(foundWord.word_id);
      console.log("foundWord.word_id");
      setErrorMessage(Object.values(newTranslations).every(t => t === null) 
        ? 'No translations found for the selected languages.' 
        : '');

      // Check if the word has an image by making a HEAD request
      fetch(`http://localhost:3001/api/words/${foundWord.word_id}/picture`, { method: 'HEAD' })
        .then(response => {
          setHasImage(response.ok);
          setImageError(!response.ok);
        })
        .catch(() => {
          setHasImage(false);
          setImageError(true);
        });
      
    } else {
      setTranslations({});
      setCurrentWordId(null);
      setHasImage(false);
      console.log(wordId)
      setErrorMessage('Word not found. Please try another search.');
    }
  };

    // Detect the direction of text
  const detectDirection = (text) => {
    const rtlPattern = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlPattern.test(text) ? 'rtl' : 'ltr';
  };
  

  // Handle changes to the search term
  const handleSearchChange = (e) => {
  const inputValue = e.target.value;

  const detectedDirection = detectDirection(inputValue);

  // Set the search term and clear error messages
  setSearchTerm(inputValue);
  setErrorMessage('');

  // Update the input field direction
  e.target.setAttribute('dir', detectedDirection);
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
      <div className="dictionary-box-content">
        <div className="dictionary-content-text">
          <p><strong>Translated Word:</strong> </p> 
          <p> {translation.translated_word || 'N/A'}</p>
          <p><strong>Word Class:</strong></p> 
          <p> {translation.word_class || 'N/A'}</p>
          <p><strong>Pronunciation:</strong></p> 
          <p> {translation.pronunciation || 'N/A'}</p>
          <p><strong>Synonym:</strong></p> 
          <p> {translation.synonym || 'N/A'}</p>
          <p><strong>Usage Sentence:</strong></p> 
          <p> {translation.usage_sentence || 'N/A'}</p>
        </div>

        {/* {translation.audio_file && translation.audio_file.data && (
          <audio controls className="dictionary-audio-player">
            <source 
              src={`data:audio/mpeg;base64,${btoa(String.fromCharCode.apply(null, translation.audio_file.data))}`} 
              type="audio/mpeg" 
            />
            Your browser does not support the audio element.
          </audio>
        )} */}

        {translation.has_audio && (
          <audio 
            controls 
            className="dictionary-audio-player"
            key={translation.translations_id} // Add key to force re-render when translation changes
          >
            <source 
              src={`http://localhost:3001/api/translations/${translation.translations_id}/audio`}
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

  // Add image display section after search results
  const renderImage = () => {
    if (!wordId) return null;
  
    if (hasImage) {
      return (
        // <div className="dictionary-image-container">
          <div className="dictionary-image-wrapper">
            <img 
              src={`http://localhost:3001/api/words/${wordId}/picture`}
              alt="Word illustration"
              className="dictionary-large-image"
              onError={() => {
                setImageError(true);
                setHasImage(false);
              }}
            />
          </div>
        // </div>
      );
    }
  
    if (imageError || !hasImage) {
      return (
        <div className="dictionary-image-container">
          <div className="dictionary-image-placeholder">
            No image available
          </div>
        </div>
      );
    }
  
    return null;
  };

  return (
    <div className="dictionary-page">
      <div className="dictionary-header">
        <div className="left-button">
          <button onClick={handleNavigateToHelp} className="help-button">
            i
          </button>
        </div>
        
        <h1>South Asian Multilingual Dictionary</h1>
        
        <div className="right-button">
          <button 
            className="admin-login-button" 
            onClick={() => window.location.href = 'http://localhost:3001/auth/google'}
          >
            Admin Login
          </button>
        </div>
      </div>

      <div className="dictionary-search-bar-container">
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
        onChange={(e) => {
          handleSearchChange(e);
        }}
        style={{
          // textAlign: detectDirection(searchTerm) === 'rtl' ? 'right' : 'left',
          textAlign: 'center'
        }}
      />

        
        <button onClick={handleTranslate}>Translate</button>
      </div>

      {errorMessage && <p className="dictionary-error-message">{errorMessage}</p>}

      <div className="dictionary-boxes">
        {Object.keys(selectedLanguages).map((boxId) => (
          <div className="dictionary-box" key={boxId}>
            <select
              className="dictionary-boxTitle"
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

      {/* {wordId && renderImage()} */}
      {renderImage()}
      
      {/* {translations[1] && (
        <div className="dictionary-image-container">
          <img 
            src={translations[2].picture} // Use placeholder or default image
            alt= ""
            className="dictionary-large-image"
          />
        </div>
      )} */}
    </div>
  );
};

export default Dictionary;




