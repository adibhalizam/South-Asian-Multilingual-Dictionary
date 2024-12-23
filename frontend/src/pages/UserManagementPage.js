import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/UserManagement.css';

const UserManagementPage = () => {
  // Initial state with predefined admins
  const [managerEmails, setManagerEmails] = useState(['manager1@domain.com']); // Example manager emails
  const [languages, setLanguages] = useState({
    Bengali: ['admin1@bengali.com'],
    Hindi: ['admin2@hindi.com'],
    Punjabi: ['admin3@punjabi.com'],
    Urdu: ['admin4@urdu.com'],
    Persian: ['admin5@persian.com'],
  });

  const [activeTab, setActiveTab] = useState('manager'); // State to track the active tab

  // Handle manager email change
  const handleManagerEmailChange = (index, e) => {
    const updatedManagerEmails = [...managerEmails];
    updatedManagerEmails[index] = e.target.value;
    setManagerEmails(updatedManagerEmails);
  };

  // Add new manager email
  const handleAddManagerEmail = () => {
    setManagerEmails([...managerEmails, '']);
  };

  // Handle language admin email change
  const handleLanguageEmailChange = (language, index, e) => {
    const updatedLanguages = { ...languages };
    updatedLanguages[language][index] = e.target.value;
    setLanguages(updatedLanguages);
  };

  // Add new admin email for a language
  const handleAddLanguageEmail = (language) => {
    const updatedLanguages = { ...languages };
    updatedLanguages[language].push('');
    setLanguages(updatedLanguages);
  };

  // Tab switch handler
  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="user-management-page">
      {/* Back button */}
      <Link to="/content" className="back-button">⬅ Back</Link>

      {/* Tabs navigation */}
      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'manager' ? 'active' : ''}`}
            onClick={() => switchTab('manager')}
          >
            Manager
          </button>
          <button
            className={`tab ${activeTab === 'language-admin' ? 'active' : ''}`}
            onClick={() => switchTab('language-admin')}
          >
            Language Admin
          </button>
        </div>

        {/* Tab content */}
        <div className="tab-content">
          {/* Manager Section */}
          {activeTab === 'manager' && (
            <div className="manager-section">
              <h2>Manager</h2>
              <p>Manage the emails of system managers here.</p>
              <table className="table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Add More</th>
                  </tr>
                </thead>
                <tbody>
                  {managerEmails.map((email, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => handleManagerEmailChange(index, e)}
                          placeholder="Enter manager's email"
                        />
                      </td>
                      <td>
                        {index === managerEmails.length - 1 && (
                          <button onClick={handleAddManagerEmail} className="add-more">
                            +
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Language Admin Section */}
          {activeTab === 'language-admin' && (
            <div className="language-admin-section">
              <h2>Language Admin</h2>
              <p>Add and manage administrators for each language.</p>
              {Object.keys(languages).map((language) => (
                <div className="language-admin" key={language}>
                  <h3>{language}</h3> 
                  {languages[language].map((email, index) => (
                    <div key={index}>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => handleLanguageEmailChange(language, index, e)}
                        placeholder={`Enter ${language} admin's email`}
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddLanguageEmail(language)}
                    className="add-more"
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
