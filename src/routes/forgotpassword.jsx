import React, { useState } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { createGlobalStyle } from 'styled-components';
import { userPool } from './awsConfig'; // Adjust the path as necessary

const GlobalStyle = createGlobalStyle`
  /* forgotpassword.css */
  .forgot-password-container {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--background, #f0f0f0);
    padding: 1rem;
  }
  .forgot-password-wrapper {
    width: 100%;
    max-width: 400px;
    background: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .forgot-password-title {
    margin-bottom: 1.5rem;
    text-align: center;
    font-size: 1.875rem;
    font-weight: bold;
    color: var(--foreground, #333);
  }
  .forgot-password-form {
    display: flex;
    flex-direction: column;
  }
  .input-group {
    margin-bottom: 1rem;
  }
  .input-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: var(--foreground, #333);
  }
  .input-group input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    font-size: 1rem;
  }
  .error-message {
    color: red;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }
  .reset-button {
    width: 100%;
    padding: 0.75rem;
    background-color: var(--primary, #007bff);
    color: white;
    border: none;
    border-radius: 0.25rem;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
  }
  .reset-button:hover {
    background-color: var(--primary-dark, #0056b3);
  }
  .back-to-login {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.875rem;
    color: var(--foreground, #333);
    cursor: pointer;
    text-decoration: underline;
  }
  .logo {
    display: block;
    margin: 0 auto 1.5rem;
    width: 200px;
  }
`;

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const handleForgotPassword = () => {
    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);
    cognitoUser.forgotPassword({
      onSuccess: () => {
        console.log('Forgot password step 1 successful');
      },
      onFailure: (err) => {
        console.error('Forgot password step 1 error:', err);
        if (err.code === 'UserNotFoundException') {
          setError('Username does not exist. Please sign up.');
        } else {
          setError(err.message || JSON.stringify(err));
        }
      },
      inputVerificationCode: () => {
        console.log('Forgot password verification code sent');
        setStep(2); // Move to step 2 after the code is sent
      },
    });
  };

  const handleConfirmPasswordReset = () => {
    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmPassword(resetCode, newPassword, {
      onSuccess: () => {
        console.log('Password reset successful');
        alert('Password reset successful');
        setStep(1); // Reset to step 1 after successful password change
        window.location.href = '/login'; // Redirect to login page
      },
      onFailure: (err) => {
        console.error('Confirm password reset error:', err);
        setError(err.message || JSON.stringify(err));
      },
    });
  };

  return (
    <>
      <GlobalStyle />
      <div className="forgot-password-container">
        <div className="forgot-password-wrapper">
          <img src="src/components/NewImages.png" alt="Logo" className="logo" />
          <h2 className="forgot-password-title">Forgot Password</h2>
          {step === 1 ? (
            <form className="forgot-password-form">
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button
                type="button"
                className="reset-button"
                onClick={handleForgotPassword}
              >
                Send Reset Code
              </button>
            </form>
          ) : (
            <form className="forgot-password-form">
              <div className="input-group">
                <label htmlFor="resetCode">Verification Code</label>
                <input
                  type="text"
                  id="resetCode"
                  name="resetCode"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button
                type="button"
                className="reset-button"
                onClick={handleConfirmPasswordReset}
              >
                Reset Password
              </button>
            </form>
          )}
          <div className="back-to-login" onClick={() => (window.location.href = '/login')}>
            Back to Login
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
