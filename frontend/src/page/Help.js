// src/page/Help.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Correct import
import './style/Help.css';

const Help = () => {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const handleGoBack = () => {
    navigate('/'); // Navigate back to the dictionary (home page)
  };

  return (
    <div className="help-container">
      <button className="back-button" onClick={handleGoBack}>
         Back to Dictionary
      </button>
      <h1 className="help-title">Help & Guidance</h1>

      <section className="help-section">
        <h2 className="section-title">Guidance for Users</h2>
        <div className="help-list">
          <p>1. Select the language you want to type in.</p>
          <p>2. Enter the word in the selected language.</p>
          <p>3. Click the "Translate" button to get the translation.</p>
          <p>4. To change languages, click on the language name at the top of any input or output box and select your preferred language.</p>
        </div>
      </section>

      <section className="help-section">
        <h2 className="section-title">Guidance for Admins</h2>
        <div className="help-list">
          <p>1. Scroll down to the bottom of the dictionary page and click the "Admin Login" button.</p>
          <p>2. Log in using your <code>umich.edu</code> email.</p>
          <p>3. Once logged in, use the navigation bar to explore admin features.</p>
        </div>

        <h3 className="subsection-title">Managing Content</h3>
        <div className="help-list">
          <p>1. Admins and language instructors can search for words.</p>
          <p>2. Click on a word that you have permission to edit.</p>
          <p>3. View or update the word's translation, pronunciation, and other details.</p>
        </div>

        <h3 className="subsection-title">Adding a New English Word</h3>
        <div className="help-list">
          <p>1. Click the "+ New Word" button.</p>
          <p>2. Enter the English word along with its details.</p>
          <p>3. Upload an image and audio file if available.</p>
          <p>4. Save the word to add it to the dictionary.</p>
        </div>

        <h3 className="subsection-title">Managing Users</h3>
        <div className="help-list">
          <p>1. Go to the "Settings" page.</p>
          <p>2. Add, remove, or modify existing users.</p>
          <p>3. Ensure user roles are correctly assigned based on permissions.</p>
        </div>

        <h3 className="subsection-title">Logging Out</h3>
        <div className="help-list">
          <p>1. Click the "Logout" button.</p>
          <p>2. After logging out, you will be redirected back to the dictionary page.</p>
        </div>
      </section>
    </div>
  );
};

export default Help;