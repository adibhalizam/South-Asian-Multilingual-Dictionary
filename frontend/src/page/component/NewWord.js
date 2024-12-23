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
    audio: '',
    image: '',
  });
  const [file, setFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddWordSubmit = (e) => {
    e.preventDefault();
    onSubmitWord(wordData); // Pass word data to parent handler
    onClose(); // Close the popup after submission
  };

  const handleFileImportSubmit = (e) => {
    e.preventDefault();
    onImportFile(file); // Pass file to parent handler
    onClose(); // Close the popup after submission
  };

  return (
    <div className="new-word-modal">
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
            Audio URL:
            <input
              type="text"
              name="audio"
              value={wordData.audio}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Image URL:
            <input
              type="text"
              name="image"
              value={wordData.image}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit" className="submit-button">Add Word</button>
        </form>
      )}

      {activeTab === 'importFile' && (
        <form onSubmit={handleFileImportSubmit} className="import-file-form">
          <label>
            Upload Excel File:
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} required />
          </label>
          <button type="submit" className="submit-button">Import File</button>
        </form>
      )}
    </div>
  );
};

export default NewWord;
