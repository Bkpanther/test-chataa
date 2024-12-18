// Frontend: React.js
import React, { useState } from 'react';
import axios from 'axios';

const LdapAuthApp = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth', { userId, password });
      if (response.data.success) {
        setMessage('Authentication successful!');
      } else {
        setMessage('Authentication failed.');
      }
    } catch (error) {
      setMessage('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h1>LDAP Authentication</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? 'Authenticating...' : 'Login'}
        </button>
      </form>
      {message && <p style={{ marginTop: '20px' }}>{message}</p>}
    </div>
  );
};

export default LdapAuthApp;

// Backend: Node.js (Express)
const express = require('express');
const ldap = require('ldapjs');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// LDAP Configuration
const ldapOptions = {
  url: 'ldaps://ldap.example.com:636', // Update with your LDAP server details
  tlsOptions: {
    ca: [fs.readFileSync('./path/to/ldap_certificate.pem')], // Path to LDAP certificate
  },
};

app.post('/api/auth', (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ success: false, message: 'User ID and password are required.' });
  }

  const client = ldap.createClient(ldapOptions);

  const dn = `uid=${userId},ou=users,dc=example,dc=com`; // Update with your LDAP structure

  client.bind(dn, password, (err) => {
    if (err) {
      console.error('LDAP bind error:', err);
      res.status(401).json({ success: false, message: 'Authentication failed.' });
    } else {
      res.status(200).json({ success: true, message: 'Authentication successful.' });
    }
    client.unbind();
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
