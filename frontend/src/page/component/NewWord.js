import React, { useState } from 'react';
import '../style/NewWord.css';

const NewWord = ({ onClose, onSubmitWord, onImportFile }) => {
  const [activeTab, setActiveTab] = useState('addWord');
  const [wordData, setWordData] = useState({
    englishWord: '',
    language: '',
    translatedWord: '',
    wordClass: '',
    pronunciation: '',
    synonym: '',
    usageSentence: '',
    audio: null, // Now storing the audio file
    image: null, // Now storing the image file
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const selectedFile = e.target.files[0];

    if (type === 'audio') {
      // Validate audio file (mp3, wav, ogg)
      if (selectedFile && !selectedFile.type.startsWith('audio')) {
        setError('Please select a valid audio file (mp3, wav, ogg).');
        return;
      }
      setWordData((prev) => ({ ...prev, audio: selectedFile }));
    } else if (type === 'image') {
      // Validate image file (jpg, jpeg, png, gif)
      if (selectedFile && !selectedFile.type.startsWith('image')) {
        setError('Please select a valid image file (jpg, jpeg, png, gif).');
        return;
      }
      setWordData((prev) => ({ ...prev, image: selectedFile }));
    }

    // Clear error if a valid file is selected
    setError('');
  };

  const handleAddWordSubmit = (e) => {
    e.preventDefault();
    if (!wordData.audio || !wordData.image) {
      setError('Both audio and image files are required.');
      return;
    }
    onSubmitWord(wordData); // Pass word data to parent handler
    onClose(); // Close the popup after submission
  };

  const handleFileImportSubmit = (e) => {
    e.preventDefault();
    onImportFile(file); // Pass file to parent handler
    onClose(); // Close the popup after submission
  };

  return (
    <div className="new-word">
      <button className="close-button" onClick={onClose}>X</button>
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'addWord' ? 'active' : ''}`}
          onClick={() => setActiveTab('addWord')}
        >
          Add Word
        </button>
        <button
          className={`tab ${activeTab === 'importFile' ? 'active' : ''}`}
          onClick={() => setActiveTab('importFile')}
        >
          Import File
        </button>
      </div>

      {activeTab === 'addWord' && (
        <form onSubmit={handleAddWordSubmit} className="add-word-form">
          <label>
            English Word:
            <input
              type="text"
              name="englishWord"
              value={wordData.englishWord}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Language:
            <select
              name="language"
              value={wordData.language}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a language</option>
              <option value="Urdu">Urdu</option>
              <option value="Bengali">Bengali</option>
              <option value="Hindi">Hindi</option>
              <option value="Punjabi">Punjabi</option>
              <option value="Tamil">Tamil</option>
              <option value="Persian">Persian</option>
            </select>
          </label>
          <label>
            Translated Word:
            <input
              type="text"
              name="translatedWord"
              value={wordData.translatedWord}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Word Class:
            <input
              type="text"
              name="wordClass"
              value={wordData.wordClass}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Pronunciation:
            <input
              type="text"
              name="pronunciation"
              value={wordData.pronunciation}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Synonym:
            <input
              type="text"
              name="synonym"
              value={wordData.synonym}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Usage Sentence:
            <textarea
              name="usageSentence"
              value={wordData.usageSentence}
              onChange={handleInputChange}
            />
          </label>
          
          <label>
            Audio File:
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => handleFileChange(e, 'audio')}
            />
          </label>
          <label>
            Image File:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'image')}
            />
          </label>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button">Add Word</button>
        </form>
      )}

      {activeTab === 'importFile' && (
        <form onSubmit={handleFileImportSubmit} className="import-file-form">
          <label htmlFor="file-upload">Upload Excel File:</label>
          <input
            type="file"
            id="file-upload"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            required
          />
          <label htmlFor="file-upload" className="file-label">
            Choose File
          </label>
          <button type="submit" className="submit-button">
            Import File
          </button>
        </form>

      )}
    </div>
  );
};

export default NewWord;
