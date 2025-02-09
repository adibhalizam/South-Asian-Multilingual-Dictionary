import React, { useState, useEffect } from 'react';
import '../style/WordDetails.css';

const WordDetailsBox = ({ wordDetails, onClose, onUpdate, onDelete }) => {
  // const [editableWord, setEditableWord] = useState(wordDetails);
  const [editableWord, setEditableWord] = useState({
    ...wordDetails,
    picture: undefined // Initialize picture as undefined
  });
  const [previewImage, setPreviewImage] = useState(null);
  const languages = ['Bengali', 'Hindi', 'Persian', 'Punjabi', 'Tamil', 'Urdu'];

  useEffect(() => {
    // If there's an existing image, fetch and display it
    if (editableWord.type === 'english' && editableWord.id) {
      fetch(`http://localhost:3001/api/words/${editableWord.id}/image`)
        .then(response => {
          if (response.ok) {
            return response.blob();
          }
          throw new Error('Image not found');
        })
        .then(blob => {
          setPreviewImage(URL.createObjectURL(blob));
        })
        .catch(error => {
          console.error('Error loading image:', error);
          setPreviewImage(null);
        });
    }
  }, [editableWord.id]);

  // Define RTL languages
  const rtlLanguages = {
    1: true,  // Urdu
    6: true   // Persian
  };

  const isRTL = (languageIndex) => rtlLanguages[languageIndex] || false;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableWord(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setEditableWord(prev => ({
          ...prev,
          picture: reader.result // Store base64 string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // const handleUpdate = () => {
  //   onUpdate(editableWord);
  // };
  const handleUpdate = () => {
    // Only include picture in update if it was changed
    const updateData = {
      ...editableWord,
      picture: editableWord.picture // This will be undefined if no new image was selected
    };
    onUpdate(updateData);
  };

  const handleDelete = () => {
    const message = editableWord.type === 'english'
      ? 'This will delete the English word and all its translations. Continue?'
      : 'This will delete this translation. Continue?';

    if (window.confirm(message)) {
      onDelete(editableWord.id, editableWord.type === 'english');
    }
  };

  // Function to get text direction style based on field and language
  const getDirectionStyle = (fieldName) => {
    if (editableWord.type === 'english' || !editableWord.languageIndex) {
      return {};
    }

    // Word Class and Pronunciation always LTR
    if (fieldName === 'wordClass' || fieldName === 'pronunciation') {
      return { direction: 'ltr' };
    }

    // For other fields, use language-based direction
    return {
      direction: isRTL(editableWord.languageIndex) ? 'rtl' : 'ltr'
    };
  };

  return (
    <div className="word-details-box">
      <button onClick={onClose} className="word-details-close-button">X</button>
      <div className="word-details">
        {editableWord.type === 'english' ? (
          <>
            <h2>Edit English Word</h2>
            <label>
              English Word:
              <input
                type="text"
                name="englishWord"
                value={editableWord.englishWord}
                onChange={handleChange}
              />
            </label>
            <label>
              Picture:
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
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
          </>
        ) : (
          <>
            <h2>{`${languages[editableWord.languageIndex - 1]} Translation for "${editableWord.englishWord}"`}</h2>
            <label>
              Translated Word:
              <input
                type="text"
                name="translatedWord"
                value={editableWord.translatedWord || ''}
                onChange={handleChange}
                style={getDirectionStyle('translatedWord')}
              />
            </label>
            <label>
              Word Class:
              <input
                type="text"
                name="wordClass"
                value={editableWord.wordClass || ''}
                onChange={handleChange}
                style={getDirectionStyle('wordClass')}
              />
            </label>
            <label>
              Pronunciation:
              <input
                type="text"
                name="pronunciation"
                value={editableWord.pronunciation || ''}
                onChange={handleChange}
                style={getDirectionStyle('pronunciation')}
              />
            </label>
            <label>
              Synonym:
              <input
                type="text"
                name="synonym"
                value={editableWord.synonym || ''}
                onChange={handleChange}
                style={getDirectionStyle('synonym')}
              />
            </label>
            <label>
              Usage Sentence:
              <textarea
                name="usageSentence"
                value={editableWord.usageSentence || ''}
                onChange={handleChange}
                style={getDirectionStyle('usageSentence')}
              />
            </label>
          </>
        )}
      </div>

      <div className="word-details-actions">
        <button onClick={handleUpdate} className="word-details-update-button">
          Update
        </button>
        <button onClick={handleDelete} className="word-details-delete-button">
          Delete
        </button>
      </div>
    </div>
  );
};

export default WordDetailsBox;