import React, { useState } from 'react';
import '../style/WordDetails.css';

const WordDetailsBox = ({ wordDetails, onClose, onUpdate, onDelete }) => {
  const [editableWord, setEditableWord] = useState({ ...wordDetails });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableWord((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    onUpdate(editableWord);
    onClose();
  };

  const handleDelete = () => {
    onDelete(editableWord.id); // Assuming `id` is part of wordDetails.
    onClose();
  };

  if (!editableWord) return null;

  return (
    <div className="word-details-box">
      <button onClick={onClose} className="word-details-close-button">X</button>
      <div className="word-details">
        <h2>Edit Word Details</h2>
      
      <label>
        Word:
        <input
          type="text"
          name="word"
          value={editableWord.word}
          onChange={handleChange}
        />
      </label>
      <label>
        Word Class:
        <input
          type="text"
          name="wordClass"
          value={editableWord.wordClass}
          onChange={handleChange}
        />
      </label>
      <label>
        Pronunciation:
        <input
          type="text"
          name="pronunciation"
          value={editableWord.pronunciation}
          onChange={handleChange}
        />
      </label>
      <label>
        Synonym:
        <input
          type="text"
          name="synonym"
          value={editableWord.synonym}
          onChange={handleChange}
        />
      </label>
      <label>
        Usage Sentence:
        <textarea
          type="text"
          name="usageSentence"
          value={editableWord.usageSentence}
          onChange={handleChange}
        />
      </label>
      <label>
        Audio URL:
        <input
          type="text"
          name="audio"
          value={editableWord.audio}
          onChange={handleChange}
        />
      </label>

      </div>
      <div className="word-details-actions">
        <button onClick={handleUpdate} className="word-details-update-button">Update</button>
        <button onClick={handleDelete} className="word-details-delete-button">Delete</button>
      </div>
    </div>
  );
};

export default WordDetailsBox;
