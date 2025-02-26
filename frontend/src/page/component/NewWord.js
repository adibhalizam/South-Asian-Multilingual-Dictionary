import React, { useState } from 'react';
import '../style/NewWord.css';

const NewWord = ({ onClose, onSubmitWord }) => {
  const [activeTab, setActiveTab] = useState('addWord');
  const [wordData, setWordData] = useState({
    englishWord: '',
    picture: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWordData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setWordData(prev => ({
          ...prev,
          picture: reader.result // Store base64 string
        }));
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleAddWordSubmit = (e) => {
    e.preventDefault();
    if (!wordData.englishWord.trim()) {
      setError('English word is required');
      return;
    }
    onSubmitWord(wordData);
  };

  const handleImportFileChange = (e) => {
    setFile(e.target.files[0]);
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
            Picture (optional):
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>

          {previewImage && (
            <div className="image-preview">
              <img 
                src={previewImage} 
                alt="Preview" 
                style={{ maxWidth: '200px', maxHeight: '200px' }}
              />
            </div>
          )}
          
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="submit-button">Add Word</button>
        </form>
      )}

      {activeTab === 'importFile' && (
        <form className="import-file-form">
          <label>
            Upload Excel File:
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleImportFileChange}
            />
          </label>
          <button type="submit" className="submit-button">Import File</button>
        </form>
      )}
    </div>
  );
};

export default NewWord;