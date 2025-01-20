// import React, { useState } from 'react';
// import '../style/WordDetails.css';

// // const WordDetailsBox = ({ wordDetails, onClose, onUpdate, onDelete }) => {
// //   const [editableWord, setEditableWord] = useState(wordDetails);
// //   const isEnglishWord = !wordDetails.translation_id;

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setEditableWord(prev => ({ ...prev, [name]: value }));
// //   };

// //   const handleFileChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file && file.type.startsWith('image/')) {
// //       setEditableWord(prev => ({ ...prev, picture: file }));
// //     }
// //   };

// //   const handleUpdate = () => {
// //     onUpdate(editableWord, isEnglishWord);
// //   };

// //   const handleDelete = () => {
// //     const message = isEnglishWord 
// //       ? 'This will delete the English word and all its translations. Continue?' 
// //       : 'This will reset this translation to N/A. Continue?';
    
// //     if (window.confirm(message)) {
// //       onDelete(editableWord.id, isEnglishWord);
// //     }
// //   };

// //   return (
// //     <div className="word-details-box">
// //       <button onClick={onClose} className="word-details-close-button">X</button>
// //       <div className="word-details">
// //         <h2>Edit {isEnglishWord ? 'English Word' : 'Translation'}</h2>
        
// //         {isEnglishWord ? (
// //           <>
// //             <label>
// //               English Word:
// //               <input
// //                 type="text"
// //                 name="english_word"
// //                 value={editableWord.english_word}
// //                 onChange={handleChange}
// //               />
// //             </label>
// //             <label>
// //               Picture:
// //               <input
// //                 type="file"
// //                 accept="image/*"
// //                 onChange={handleFileChange}
// //               />
// //             </label>
// //             {editableWord.picture && (
// //               <div className="current-picture">
// //                 Current Picture Available
// //               </div>
// //             )}
// //           </>
// //         ) : (
// //           <>
// //             <label>
// //               Translated Word:
// //               <input
// //                 type="text"
// //                 name="translated_word"
// //                 value={editableWord.translated_word}
// //                 onChange={handleChange}
// //               />
// //             </label>
// //             <label>
// //               Word Class:
// //               <input
// //                 type="text"
// //                 name="word_class"
// //                 value={editableWord.word_class || ''}
// //                 onChange={handleChange}
// //               />
// //             </label>
// //             <label>
// //               Pronunciation:
// //               <input
// //                 type="text"
// //                 name="pronunciation"
// //                 value={editableWord.pronunciation || ''}
// //                 onChange={handleChange}
// //               />
// //             </label>
// //             <label>
// //               Synonym:
// //               <input
// //                 type="text"
// //                 name="synonym"
// //                 value={editableWord.synonym || ''}
// //                 onChange={handleChange}
// //               />
// //             </label>
// //             <label>
// //               Usage Sentence:
// //               <textarea
// //                 name="usage_sentence"
// //                 value={editableWord.usage_sentence || ''}
// //                 onChange={handleChange}
// //               />
// //             </label>
// //           </>
// //         )}
// //       </div>

// //       <div className="word-details-actions">
// //         <button onClick={handleUpdate} className="word-details-update-button">
// //           Update
// //         </button>
// //         <button onClick={handleDelete} className="word-details-delete-button">
// //           Delete
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };


// const WordDetailsBox = ({ wordDetails, onClose, onUpdate, onDelete }) => {
//   const [editableWord, setEditableWord] = useState(wordDetails);
//   const languages = ['Bengali', 'Hindi', 'Persian', 'Punjabi', 'Tamil', 'Urdu'];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditableWord(prev => ({ ...prev, [name]: value }));
//   };

//   const handleUpdate = () => {
//     onUpdate(editableWord);
//   };

//   const handleDelete = () => {
//     const message = editableWord.type === 'english'
//       ? 'This will delete the English word and all its translations. Continue?'
//       : 'This will delete this translation. Continue?';

//     if (window.confirm(message)) {
//       onDelete(editableWord.id, editableWord.type === 'english');
//     }
//   };

//   return (
//     <div className="word-details-box">
//       <button onClick={onClose} className="word-details-close-button">X</button>
//       <div className="word-details">
//         {editableWord.type === 'english' ? (
//           <>
//             <h2>Edit English Word</h2>
//             <label>
//               English Word:
//               <input
//                 type="text"
//                 name="englishWord"
//                 value={editableWord.englishWord}
//                 onChange={handleChange}
//               />
//             </label>
//             <label>
//               Picture:
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => handleChange({
//                   target: { name: 'picture', value: e.target.files[0] }
//                 })}
//               />
//             </label>
//           </>
//         ) : (
//           <>
//             <h2>{`${languages[editableWord.languageIndex - 1]} Translation for "${editableWord.englishWord}"`}</h2>
//             <label>
//               Translated Word:
//               <input
//                 type="text"
//                 name="translatedWord"
//                 value={editableWord.translatedWord || ''}
//                 onChange={handleChange}
//               />
//             </label>
//             <label>
//               Word Class:
//               <input
//                 type="text"
//                 name="wordClass"
//                 value={editableWord.wordClass || ''}
//                 onChange={handleChange}
//               />
//             </label>
//             <label>
//               Pronunciation:
//               <input
//                 type="text"
//                 name="pronunciation"
//                 value={editableWord.pronunciation || ''}
//                 onChange={handleChange}
//               />
//             </label>
//             <label>
//               Synonym:
//               <input
//                 type="text"
//                 name="synonym"
//                 value={editableWord.synonym || ''}
//                 onChange={handleChange}
//               />
//             </label>
//             <label>
//               Usage Sentence:
//               <textarea
//                 name="usageSentence"
//                 value={editableWord.usageSentence || ''}
//                 onChange={handleChange}
//               />
//             </label>
//           </>
//         )}
//       </div>

//       <div className="word-details-actions">
//         <button onClick={handleUpdate} className="word-details-update-button">
//           Update
//         </button>
//         <button onClick={handleDelete} className="word-details-delete-button">
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// };

// export default WordDetailsBox;

import React, { useState } from 'react';
import '../style/WordDetails.css';

const WordDetailsBox = ({ wordDetails, onClose, onUpdate, onDelete }) => {
  const [editableWord, setEditableWord] = useState(wordDetails);
  const languages = ['Bengali', 'Hindi', 'Persian', 'Punjabi', 'Tamil', 'Urdu'];

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

  const handleUpdate = () => {
    onUpdate(editableWord);
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
                onChange={(e) => handleChange({
                  target: { name: 'picture', value: e.target.files[0] }
                })}
              />
            </label>
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