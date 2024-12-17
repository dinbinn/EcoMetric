import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, confirmSignUp } from "../authService"; // Assuming confirmSignUp is imported here
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
/* signup.css */

.signup-container {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--background, #f0f0f0);
  padding: 1rem;
}

.signup-wrapper {
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.signup-title {
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.5rem;
}

.signup-form {
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

.signup-button {
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

.signup-button:hover {
  background-color: var(--primary-dark, #0056b3);
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: var(--foreground, #333);
}

.login-link-text {
  color: var(--primary, #007bff);
  cursor: pointer;
  text-decoration: underline;
}

.login-link-text:hover {
  color: var(--primary-dark, #0056b3);
}

.logo {
  display: block;
  margin: 0 auto 1.5rem;
  width: 200px; /* Increased size for the logo */
}
`;

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState(""); // New state for verification code
  const [error, setError] = useState("");
  const [isVerificationMode, setIsVerificationMode] = useState(false); // Toggle for signup/verification mode
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await signUp(username, password, email);
      setIsVerificationMode(true); // Switch to verification mode
      setError(""); // Clear any previous errors
    } catch (error) {
      setError(`Sign up failed: ${error.message}`);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await confirmSignUp(username, verificationCode); // Assuming this method is implemented in authService.js
      navigate("/login");
    } catch (error) {
      setError(`Verification failed: ${error.message}`);
    }
  };

  return (
    <>
      <GlobalStyle />
      <div className="signup-container">
        <div className="signup-wrapper">
          <img src="src/components/NewImages.png" alt="Logo" className="logo" />
          <form className="signup-form" onSubmit={isVerificationMode ? handleVerify : handleSignUp}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isVerificationMode} // Disable field in verification mode
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isVerificationMode} // Disable field in verification mode
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isVerificationMode} // Disable field in verification mode
              />
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isVerificationMode} // Disable field in verification mode
              />
            </div>
            {isVerificationMode && (
              <div className="input-group">
                <label htmlFor="verificationCode">Verification Code</label>
                <input
                  type="text"
                  id="verificationCode"
                  name="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
            )}
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="signup-button">
              {isVerificationMode ? "Verify" : "Sign up"} {/* Change button text */}
            </button>
          </form>
          <div className="login-link">
            Already have an account?
            <span
              className="login-link-text"
              onClick={() => navigate("/login")}
            >
              Sign in
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
