import React, { useState, useEffect } from 'react';
import './style/Settings.css';

const Settings = () => {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('manager');
  const [languages, setLanguages] = useState({
    bengali: false,
    urdu: false,
    punjabi: false,
    persian: false,
    hindi: false,
    tamil: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteEmail, setDeleteEmail] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Check if email exists
      const checkResponse = await fetch(`http://localhost:3001/api/users/check/${email}`);
      const checkData = await checkResponse.json();
      
      if (checkData.exists) {
        setError('Email already exists');
        return;
      }

      const userData = { email, role };
      if (role === 'sysadmin') {
        userData.languages = Object.keys(languages).filter(lang => languages[lang]);
      }

      const response = await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) throw new Error('Failed to create user');
      
      setSuccess('User created successfully');
      setEmail('');
      setRole('manager');
      setLanguages(Object.keys(languages).reduce((acc, lang) => ({ ...acc, [lang]: false }), {}));
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const confirmDelete = (email) => {
    setDeleteEmail(email);
    setShowConfirmDialog(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${deleteEmail}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete user');
      
      setSuccess('User deleted successfully');
      setShowConfirmDialog(false);
      setDeleteEmail(null);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="settings-container">
      <form onSubmit={handleSubmit} className="settings-form">
         <h1 class="user-management">User Management</h1>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="manager">Manager</option>
            <option value="sysadmin">System Admin</option>
          </select>
        </div>

        {role === 'sysadmin' && (
          <div className="languages-container">
            <label>Languages:</label>
            {Object.keys(languages).map(lang => (
              <div key={lang} className="language-checkbox">
                <input
                  type="checkbox"
                  id={lang}
                  checked={languages[lang]}
                  onChange={(e) => setLanguages({...languages, [lang]: e.target.checked})}
                />
                <label htmlFor={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</label>
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="submit-button">Create User</button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="users-list">
  <div className="users-grid">
    <h2>Existing Users</h2>

    <div className="user-header">
      <div>Email</div>
      <div>Role</div>
      <div>Languages</div>
      <div>Actions</div>
    </div>

    {users.map(user => (
      <div key={user.email} className="user-row">
        <div style={{ textAlign: "right" }}>{user.email}</div>
        <div>{user.role}</div>
        <div>{user.languages ? user.languages.join(', ') : '-'}</div>
        <div>
          <button 
            onClick={() => confirmDelete(user.email)}
            className="delete-button"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
</div>


      {showConfirmDialog && (
        <div className="modal-overlay">
          <div className="confirm-dialog">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete user {deleteEmail}?</p>
            <div className="dialog-buttons">
              <button onClick={handleDelete} className="confirm-button">Yes, Delete</button>
              <button onClick={() => setShowConfirmDialog(false)} className="cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;