import React, { useState, useEffect } from 'react';
import './style/Content.css';
import WordDetailsBox from './component/WordDetails';
import NewWord from './component/NewWord';

const Content = () => {
  const [dictionaryData, setDictionaryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWord, setSelectedWord] = useState(null);
  const [showNewWordModal, setShowNewWordModal] = useState(false);

  const handleAddWord = (newWord) => {
    // Save the new word to the backend
    fetch('http://localhost:3001/api/new-words', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newWord),
    })
      .then((res) => res.json())
      .then((savedWord) => {
        setDictionaryData((prevData) => [...prevData, savedWord]);
      })
      .catch((error) => console.error('Error adding word:', error));
  };

  const handleImportFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:3001/api/words/import', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((importedData) => {
        setDictionaryData((prevData) => [...prevData, ...importedData]);
      })
      .catch((error) => console.error('Error importing file:', error));
  };

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

  const handleWordClick = (word) => {
    setSelectedWord({
      word: word.translated_word,
      wordClass: word.word_class,
      pronunciation: word.pronunciation,
      synonym: word.synonym,
      usageSentence: word.usage_sentence,
      audio: word.audio,
    });
  };

  const handleUpdate = async (updatedWord) => {
    try {
      const response = await fetch(`http://localhost:3001/api/new-words/${updatedWord.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedWord),
      });
      if (!response.ok) throw new Error('Failed to update word');

      setDictionaryData((prevData) =>
        prevData.map((word) => (word.id === updatedWord.id ? updatedWord : word))
      );
    } catch (error) {
      console.error('Error updating word:', error);
    }
  };

  const handleDelete = async (wordId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/words/${wordId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete word');

      setDictionaryData((prevData) => prevData.filter((word) => word.id !== wordId));
    } catch (error) {
      console.error('Error deleting word:', error);
    }
  };

  const filteredData = dictionaryData.filter(item => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      item.english_word.toLowerCase().startsWith(lowerCaseSearchTerm) ||
      Object.keys(item.translations).some((key) => {
        const translation = item.translations[key];
        return translation && translation.translated_word.toLowerCase().startsWith(lowerCaseSearchTerm);
      })
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (a.english_word.toLowerCase() < b.english_word.toLowerCase()) return -1;
    if (a.english_word.toLowerCase() > b.english_word.toLowerCase()) return 1;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

const renderPagination = () => {
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    // Add first, last, and surrounding pages
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 2 && i <= currentPage + 2)
    ) {
      pageNumbers.push(i);
    }
  }

  return pageNumbers.map((pageNum, index, arr) => {
    const isFirst = pageNum === arr[0];
    const isLast = pageNum === arr[arr.length - 1];

    return (
      <span
        key={pageNum}
        onClick={() => handlePageChange(pageNum)}
        className={`page-number ${pageNum === currentPage ? 'active' : ''} ${isFirst ? 'first' : ''} ${isLast ? 'last' : ''}`}
      >
        {pageNum}
      </span>
    );
  });
};


  return (
    <div className="content-page">
      <h1>Multilingual Dictionary Content</h1>

      {errorMessage && <p className="content-error-message">{errorMessage}</p>}

      <input
        type="text"
        placeholder="Search word"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <div className="content-container">
        <div className="content-header">
          <div>English</div>
          <div>Bengali</div>
          <div>Hindi</div>
          <div>Persian</div>
          <div>Punjabi</div>
          <div>Tamil</div>
          <div>Urdu</div>
        </div>

        {currentItems.map((item) => (
          <div
            key={item.id}
            className="content-item"
            onClick={() => handleWordClick(item)}
          >
            <div>{item.english_word}</div>
            {Object.keys(item.translations).map((key) => (
              <div key={key}>
                {item.translations[key]?.translated_word || 'No translation available'}
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
          onImportFile={handleImportFile}
        />
      )}
    </div>
  );
};

export default Content;
