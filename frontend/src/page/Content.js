import React, { useState, useEffect } from 'react';
import './style/Content.css';
import WordDetailsBox from './component/WordDetails';
import NewWord from './component/NewWord';

// Language mapping that matches database values
const LANGUAGE_MAP = {
  1: 'urdu',
  2: 'bengali',
  3: 'hindi',
  4: 'punjabi',
  5: 'tamil',
  6: 'persian'
};

const Content = () => {
  const [dictionaryData, setDictionaryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWord, setSelectedWord] = useState(null);
  const [showNewWordModal, setShowNewWordModal] = useState(false);
  const [userAccess, setUserAccess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/auth/session', {
          credentials: 'include' // Important for session cookies
        });
        const data = await response.json();
        
        if (!data.authenticated) {
          window.location.href = '/';
          return;
        }
        
        setUserAccess({
          role: data.role,
          languages: data.languages
        });
      } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/';
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Reset to first page whenever search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);


  const canEditTranslation = (languageIndex) => {
    if (!userAccess) return false;
    if (userAccess.role === 'manager') return true;
    if (userAccess.role === 'sysadmin') {
      const language = LANGUAGE_MAP[languageIndex];
      return userAccess.languages.includes(language);
    }
    return false;
  };

  const canEditEnglishWord = () => {
    return userAccess?.role === 'manager';
  };

  // const handleAddWord = async (newWord) => {
  //   try {
  //     // Check if word exists
  //     const checkResponse = await fetch(`http://localhost:3001/api/words/check/${encodeURIComponent(newWord.englishWord)}`);
  //     const { exists } = await checkResponse.json();
      
  //     if (exists) {
  //       setErrorMessage('Word already exists in the dictionary');
  //       return;
  //     }
  
  //     // Create new word with translations
  //     const response = await fetch('http://localhost:3001/api/words', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         englishWord: newWord.englishWord,
  //         picture: newWord.picture || null
  //       }),
  //     });
  
  //     if (!response.ok) throw new Error('Failed to add word');
  
  //     const savedWord = await response.json();
      
  //     // Refresh the dictionary data
  //     const refreshResponse = await fetch('http://localhost:3001/api/content/words');
  //     const refreshedData = await refreshResponse.json();
  //     setDictionaryData(refreshedData);
      
  //     setShowNewWordModal(false);
  //     setErrorMessage('');
  //   } catch (error) {
  //     console.error('Error adding word:', error);
  //     setErrorMessage('Failed to add word. Please try again.');
  //   }
  // };

  const handleAddWord = async (newWord) => {
    try {
      // First check if word exists in current dictionary data
      const wordExists = dictionaryData.some(
        item => item.english_word.toLowerCase() === newWord.englishWord.toLowerCase()
      );
      
      if (wordExists) {
        setErrorMessage('This word already exists in the dictionary');
        return;
      }
  
      // If word doesn't exist, proceed with adding it
      const response = await fetch('http://localhost:3001/api/words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          englishWord: newWord.englishWord,
          picture: newWord.picture || null
        }),
      });
  
      if (!response.ok) throw new Error('Failed to add word');
  
      // Refresh the dictionary data
      const refreshResponse = await fetch('http://localhost:3001/api/content/words', {
        credentials: 'include'
      });
      const refreshedData = await refreshResponse.json();
      setDictionaryData(refreshedData);
      
      setShowNewWordModal(false);
      setErrorMessage('');
    } catch (error) {
      console.error('Error adding word:', error);
      setErrorMessage('Failed to add word. Please try again.');
    }
  };

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


  // const handleWordClick = (word) => {
  //   setSelectedWord({
  //     id: word.word_id,
  //     englishWord: word.english_word,
  //     translations: word.translations
  //   });
  // };
  const handleWordClick = async (word, colIndex, translationId) => {
    try {
      // Check permissions first
      if (colIndex === 0 && !canEditEnglishWord()) {
        setErrorMessage('You do not have permission to edit English words');
        return;
      }
      if (colIndex > 0 && !canEditTranslation(colIndex)) {
        setErrorMessage(`You do not have permission to edit ${LANGUAGE_MAP[colIndex]} translations`);
        return;
      }
      if (colIndex === 0) {
        const response = await fetch(`http://localhost:3001/api/words/${word.word_id}`);
        const wordData = await response.json();
        setSelectedWord({
          type: 'english',
          id: wordData.word_id,
          englishWord: wordData.english_word,
          picture: wordData.picture,
          translations: wordData.translations
        });
      } else {
        const translation = word.translations[colIndex];
        if (!translation) {
          // New translation
          setSelectedWord({
            type: 'translation',
            wordId: word.word_id,
            englishWord: word.english_word,
            languageIndex: colIndex,
            isNew: true,
            translatedWord: '',
            wordClass: '',
            pronunciation: '',
            synonym: '',
            usageSentence: ''
          });
          return;
        }
  
        // Existing translation
        setSelectedWord({
          type: 'translation',
          id: translation.translations_id,
          wordId: word.word_id,
          englishWord: word.english_word,
          translatedWord: translation.translated_word,
          wordClass: translation.word_class,
          pronunciation: translation.pronunciation,
          synonym: translation.synonym,
          usageSentence: translation.usage_sentence,
          languageIndex: colIndex
        });
      }
    } catch (error) {
      console.error('Error fetching details:', error);
      setErrorMessage('Failed to fetch details');
    }
  };

  if (loading) return <div>Loading...</div>;

  const handleUpdate = async (updatedWord) => {
    try {
      if (updatedWord.type === 'english') {
        const response = await fetch(`http://localhost:3001/api/words/${updatedWord.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            english_word: updatedWord.englishWord
          }),
        });
        
        if (!response.ok) throw new Error('Failed to update word');
        
      } else {
        // Update translation using translations_id
        const response = await fetch(`http://localhost:3001/api/translations/${updatedWord.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            translated_word: updatedWord.translatedWord,
            word_class: updatedWord.wordClass,
            pronunciation: updatedWord.pronunciation,
            synonym: updatedWord.synonym,
            usage_sentence: updatedWord.usageSentence
          }),
        });
        
        if (!response.ok) throw new Error('Failed to update translation');
      }
  
      // Refresh data
      const response = await fetch('http://localhost:3001/api/content/words');
      const data = await response.json();
      setDictionaryData(data);
      setSelectedWord(null);
      
    } catch (error) {
      console.error('Error updating:', error);
      setErrorMessage('Failed to update. Please try again.');
    }
  };

  const handleDelete = async (id, isEnglishWord) => {
  try {
    if (isEnglishWord) {
      const response = await fetch(`http://localhost:3001/api/words/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete word');
      
    } else {
      const response = await fetch(`http://localhost:3001/api/translations/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete translation');
    }

    // Refresh the data using the new endpoint
    const response = await fetch('http://localhost:3001/api/content/words');
    const data = await response.json();
    setDictionaryData(data);
    setSelectedWord(null);
    
  } catch (error) {
    console.error('Error deleting:', error);
    setErrorMessage('Failed to delete. Please try again.');
  }
};

  // const filteredData = dictionaryData.filter(item =>
  //   item.english_word.toLowerCase().startsWith(searchTerm.toLowerCase())
  // );

  // const sortedData = [...filteredData].sort((a, b) =>
  //   a.english_word.toLowerCase().localeCompare(b.english_word.toLowerCase())
  // );
  

  const filteredData = dictionaryData.filter(item => {
    // If search term is empty, return all items
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    
    // Check English word
    if (item.english_word.toLowerCase().includes(searchTermLower)) {
      return true;
    }
    
    // Check translations
    return Object.values(item.translations).some(translation => 
      translation?.translated_word && 
      translation.translated_word.toLowerCase().includes(searchTermLower)
    );
  });

  const sortedData = [...filteredData].sort((a, b) =>
    a.english_word.toLowerCase().localeCompare(b.english_word.toLowerCase())
  );


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  // const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of table when page changes
    window.scrollTo(0, 0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers.map((pageNum, index, arr) => (
      <span
        key={pageNum}
        onClick={() => handlePageChange(pageNum)}
        className={`page-number ${pageNum === currentPage ? 'active' : ''} ${pageNum === arr[0] ? 'first' : ''} ${pageNum === arr[arr.length - 1] ? 'last' : ''}`}
      >
        {pageNum}
      </span>
    ));
  };

  return (
    <div className="content-page">
      <h1>Multilingual Dictionary Content</h1>
      {errorMessage && <p className="content-error-message">{errorMessage}</p>}

      <input
        type="text"
        placeholder="Search word"
        value={searchTerm}
        // onChange={(e) => setSearchTerm(e.target.value)}
        onChange={handleSearchChange}
        className="search-bar"
      />

      <div className="content-container">
        <div className="content-header">
          <div>English</div>
          <div>Urdu</div>
          <div>Bengali</div>
          <div>Hindi</div>
          <div>Punjabi</div>
          <div>Tamil</div>
          <div>Persian</div>
        </div>

        {/* {currentItems.map((item) => (
          <div
            key={item.word_id}
            className="content-item"
            onClick={() => handleWordClick(item)}
          >
            <div>{item.english_word}</div>
            {Object.entries(item.translations).map(([key, translation]) => (
              <div key={key}>
                {translation?.translated_word || 'N/A'}
              </div>
            ))}
          </div>
        ))} */}
        {currentItems.map((item) => (
          <div key={item.word_id} className="content-item">
            <div onClick={() => handleWordClick(item, 0)}>
              {item.english_word}
            </div>
            {Object.entries(item.translations).map(([key, translation], index) => (
              <div 
                key={key} 
                onClick={() => handleWordClick(item, index + 1, translation?.translation_id)}
              >
                {translation?.translated_word || 'N/A'}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="content-pagination-container">
        <div className="content-pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          {renderPagination()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={indexOfLastItem >= sortedData.length}
            className="pagination-button"
          >
            Next
          </button>
        </div>

        <button
          className="add-word-button"
          onClick={() => setShowNewWordModal(true)}
        >
          + New Word
        </button>
      </div>

      {selectedWord && (
        <WordDetailsBox
          wordDetails={selectedWord}
          onClose={() => setSelectedWord(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}

      {showNewWordModal && (
        <NewWord
          onClose={() => setShowNewWordModal(false)}
          onSubmitWord={handleAddWord}
        />
      )}
    </div>
  );
};

export default Content;