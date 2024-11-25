import React, { useState } from 'react';
import './styles/UserManagement.css';

const UserManagementPage = () => {
  // Initial state with predefined admins
  const [managerEmails, setManagerEmails] = useState(['manager1@domain.com']);  // Example manager emails
  const [languages, setLanguages] = useState({
    Bengali: ['admin1@bengali.com'],
    Hindi: ['admin2@hindi.com'],
    Punjabi: ['admin3@punjabi.com'],
    Urdu: ['admin4@urdu.com'],
    Persian: ['admin5@persian.com'],
  });

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

  return (
    <div className="user-management-page">
      <button className="back-button">Back</button>

      <div className="content-container">
        {/* Manager Section */}
        <div className="manager-section">
          <h2>Manager</h2>
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
                    {/* Add More button for Manager */}
                    {index === managerEmails.length - 1 && (
                      <button onClick={handleAddManagerEmail} className="add-more">
                        Add More Manager
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Language Admin Section */}
        <div className="language-admin-section">
          <h2>Language Admin</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Language</th>
                <th>Email</th>
                <th>Add More</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(languages).map((language) => (
                <tr key={language}>
                  <td>{language}</td>
                  <td>
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
                  </td>
                  <td>
                    {/* Add More button for each language */}
                    {languages[language].length > 0 && (
                      <button onClick={() => handleAddLanguageEmail(language)} className="add-more">
                        Add More {language} Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
