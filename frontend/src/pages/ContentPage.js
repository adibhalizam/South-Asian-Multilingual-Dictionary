import React, { useState } from 'react';
import './styles/Content.css';

const ContentPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState('English');
  const [selectedWord, setSelectedWord] = useState(null);

  // Example data with equal words across all languages
  const dictionaryData = {
    English: [
      { word: 'Health', image: 'image_url_here' },
      { word: 'Well-being', image: 'image_url_here' },
      { word: 'Life', image: 'image_url_here' },
      { word: 'Happiness', image: 'image_url_here' },
      { word: 'Peace', image: 'image_url_here' },
    ],
    Bengali: [
      { word: 'স্বাস্থ্য', wordClass: 'Noun', pronunciation: 'Shwasthyo', synonym: 'well-being', usage_sentence: 'স্বাস্থ্য আমাদের সবচেয়ে গুরুত্বপূর্ণ সম্পদ।', audio: 'audio_url_here' },
      { word: 'সুখী', wordClass: 'Adjective', pronunciation: 'Shukhi', synonym: 'joyful', usage_sentence: 'সুখী মানুষের জীবন সহজ হয়।', audio: 'audio_url_here' },
      { word: 'জীবন', wordClass: 'Noun', pronunciation: 'Jeevan', synonym: 'existence', usage_sentence: 'জীবন একটি দারুণ উপহার।', audio: 'audio_url_here' },
      { word: 'সুখ', wordClass: 'Noun', pronunciation: 'Sukh', synonym: 'happiness', usage_sentence: 'সুখ সর্বোত্তম অবস্থা।', audio: 'audio_url_here' },
      { word: 'শান্তি', wordClass: 'Noun', pronunciation: 'Shanti', synonym: 'peace', usage_sentence: 'শান্তি মানবতার জন্য অপরিহার্য।', audio: 'audio_url_here' },
    ],
    Hindi: [
      { word: 'स्वास्थ्य', wordClass: 'Noun', pronunciation: 'Swasthya', synonym: 'well-being', usage_sentence: 'स्वास्थ्य सबसे बड़ी संपत्ति है।', audio: 'audio_url_here' },
      { word: 'सुखी', wordClass: 'Adjective', pronunciation: 'Shukhi', synonym: 'joyful', usage_sentence: 'सुखी लोगों की जिंदगी सरल होती है।', audio: 'audio_url_here' },
      { word: 'जीवन', wordClass: 'Noun', pronunciation: 'Jeevan', synonym: 'existence', usage_sentence: 'जीवन एक अमूल्य उपहार है।', audio: 'audio_url_here' },
      { word: 'खुशी', wordClass: 'Noun', pronunciation: 'Khushi', synonym: 'happiness', usage_sentence: 'खुशी जीवन का सबसे महत्वपूर्ण हिस्सा है।', audio: 'audio_url_here' },
      { word: 'शांति', wordClass: 'Noun', pronunciation: 'Shanti', synonym: 'peace', usage_sentence: 'शांति ही सच्ची संपत्ति है।', audio: 'audio_url_here' },
    ],
    Persian: [
      { word: 'سلامتی', wordClass: 'Noun', pronunciation: 'Salamati', synonym: 'well-being', usage_sentence: 'سلامتی بزرگترین دارایی است.', audio: 'audio_url_here' },
      { word: 'شاد', wordClass: 'Adjective', pronunciation: 'Shad', synonym: 'joyful', usage_sentence: 'افراد شاد زندگی بهتری دارند.', audio: 'audio_url_here' },
      { word: 'زندگی', wordClass: 'Noun', pronunciation: 'Zendegi', synonym: 'existence', usage_sentence: 'زندگی یک هدیه ارزشمند است.', audio: 'audio_url_here' },
      { word: 'خوشبختی', wordClass: 'Noun', pronunciation: 'Khoshbakhti', synonym: 'happiness', usage_sentence: 'خوشبختی حقیقی در زندگی است.', audio: 'audio_url_here' },
      { word: 'صلح', wordClass: 'Noun', pronunciation: 'Solh', synonym: 'peace', usage_sentence: 'صلح نیاز مبرم بشریت است.', audio: 'audio_url_here' },
    ],
    Punjabi: [
      { word: 'ਸਿਹਤ', wordClass: 'Noun', pronunciation: 'Sehat', synonym: 'well-being', usage_sentence: 'ਸਿਹਤ ਸਭ ਤੋਂ ਵੱਡਾ ਤੋਹਫਾ ਹੈ।', audio: 'audio_url_here' },
      { word: 'ਸੁੱਖੀ', wordClass: 'Adjective', pronunciation: 'Sukhi', synonym: 'joyful', usage_sentence: 'ਸੁੱਖੀ ਮਨੁੱਖ ਦੀ ਜਿੰਦਗੀ ਆਸਾਨ ਹੁੰਦੀ ਹੈ।', audio: 'audio_url_here' },
      { word: 'ਜੀਵਨ', wordClass: 'Noun', pronunciation: 'Jeevan', synonym: 'existence', usage_sentence: 'ਜੀਵਨ ਇਕ ਕੀਮਤੀ ਦਾਨ ਹੈ।', audio: 'audio_url_here' },
      { word: 'ਖੁਸ਼ੀ', wordClass: 'Noun', pronunciation: 'Khushi', synonym: 'happiness', usage_sentence: 'ਖੁਸ਼ੀ ਜੀਵਨ ਦਾ ਸਭ ਤੋਂ ਮਹੱਤਵਪੂਰਨ ਹਿੱਸਾ ਹੈ।', audio: 'audio_url_here' },
      { word: 'ਸ਼ਾਂਤੀ', wordClass: 'Noun', pronunciation: 'Shanti', synonym: 'peace', usage_sentence: 'ਸ਼ਾਂਤੀ ਸਾਰੇ ਸੰਸਾਰ ਲਈ ਜਰੂਰੀ ਹੈ।', audio: 'audio_url_here' },
    ],
    Urdu: [
      { word: 'صحت', wordClass: 'Noun', pronunciation: 'Sehat', synonym: 'well-being', usage_sentence: 'صحت سب سے بڑا تحفہ ہے۔', audio: 'audio_url_here' },
      { word: 'خوش', wordClass: 'Adjective', pronunciation: 'Khush', synonym: 'joyful', usage_sentence: 'خوش لوگ زیادہ کامیاب ہوتے ہیں۔', audio: 'audio_url_here' },
      { word: 'زندگی', wordClass: 'Noun', pronunciation: 'Zindagi', synonym: 'existence', usage_sentence: 'زندگی ایک قیمتی تحفہ ہے۔', audio: 'audio_url_here' },
      { word: 'خوشی', wordClass: 'Noun', pronunciation: 'Khushi', synonym: 'happiness', usage_sentence: 'خوشی سب سے بڑی دولت ہے۔', audio: 'audio_url_here' },
      { word: 'امن', wordClass: 'Noun', pronunciation: 'Aman', synonym: 'peace', usage_sentence: 'امن کی ضرورت دنیا کے ہر کونے میں ہے۔', audio: 'audio_url_here' },
    ],
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleCellClick = (word, lang) => {
    if (lang === 'English') {
      setSelectedWord({ word: word.word, image: word.image });
    } else {
      const translatedWord = dictionaryData[lang].find((w) => w.word === word.word);
      setSelectedWord(translatedWord);
    }
  };

  const handleManageUser = () => {
    // Handle manage user functionality here
  };

  const handleLogout = () => {
    // Handle logout functionality here
  };

  return (
    <div className="content-page">

      {/* Buttons for Manage User and Logout */}
      <div className="top-right-buttons">
        <button onClick={handleManageUser}>Manage User</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search for a word"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select onChange={handleLanguageChange} value={language}>
          <option value="English">English</option>
          <option value="Bengali">Bengali</option>
          <option value="Hindi">Hindi</option>
          <option value="Persian">Persian</option>
          <option value="Punjabi">Punjabi</option>
          <option value="Urdu">Urdu</option>
        </select>
      </div>

      {/* Table Displaying Words in Multiple Languages */}
      <div className="words-table">
        <table>
          <thead>
            <tr>
              <th>English</th>
              <th>Bengali</th>
              <th>Hindi</th>
              <th>Persian</th>
              <th>Punjabi</th>
              <th>Urdu</th>
            </tr>
          </thead>
          <tbody>
            {dictionaryData['English'].map((word, index) => (
              <tr key={index}>
                <td onClick={() => handleCellClick(word, 'English')}>{word.word}</td>
                <td onClick={() => handleCellClick(dictionaryData['Bengali'][index], 'Bengali')}>{dictionaryData['Bengali'][index].word}</td>
                <td onClick={() => handleCellClick(dictionaryData['Hindi'][index], 'Hindi')}>{dictionaryData['Hindi'][index].word}</td>
                <td onClick={() => handleCellClick(dictionaryData['Persian'][index], 'Persian')}>{dictionaryData['Persian'][index].word}</td>
                <td onClick={() => handleCellClick(dictionaryData['Punjabi'][index], 'Punjabi')}>{dictionaryData['Punjabi'][index].word}</td>
                <td onClick={() => handleCellClick(dictionaryData['Urdu'][index], 'Urdu')}>{dictionaryData['Urdu'][index].word}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Display Selected Word Details */}
      {selectedWord && (
        <div className="selected-word-details">
          <h2>{selectedWord.word}</h2>
          {selectedWord.image && <img src={selectedWord.image} alt="word image" />}
          {selectedWord.wordClass && <p><strong>Word Class:</strong> {selectedWord.wordClass}</p>}
          {selectedWord.pronunciation && <p><strong>Pronunciation:</strong> {selectedWord.pronunciation}</p>}
          {selectedWord.synonym && <p><strong>Synonym:</strong> {selectedWord.synonym}</p>}
          {selectedWord.usage_sentence && <p><strong>Usage:</strong> {selectedWord.usage_sentence}</p>}
          {selectedWord.audio && <audio controls><source src={selectedWord.audio} type="audio/mp3" />Your browser does not support the audio element.</audio>}
        </div>
      )}
    </div>
  );
};

export default ContentPage;
