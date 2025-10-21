import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import { registerUser, loginUser } from '../services/api';
import '../styles/LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const clearForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }

    if (isRegistering && !email.trim()) {
      setError('Email is required for registration');
      return;
    }

    try {
      if (isRegistering) {
        const userData = { username, email, password };
        const response = await registerUser(userData);
        login(response.data, response.data.token);
        clearForm();
        navigate('/');
      } else {
        const credentials = { username, password };
        const response = await loginUser(credentials);
        login(response.data, response.data.token);
        clearForm();
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to authenticate. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          {isRegistering && (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          )}

          {error && <p className="error-message">{error}</p>}

          <button type="submit">
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        <p className="toggle-auth">
          {isRegistering
            ? 'Already have an account?'
            : "Don't have an account?"}{' '}
          <button
            type="button"
            className="toggle-button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
          >
            {isRegistering ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;