import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../authService";
import { UserContext } from "../context/userContext";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
/* login.css */

.login-container {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--background, #f0f0f0);
  padding: 1rem;
}

.login-wrapper {
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-title {
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.875rem;
  font-weight: bold;
  color: var(--foreground, #333);
}

.login-form {
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

.forgot-password {
  display: block;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: var(--primary, #007bff);
  cursor: pointer;
  text-decoration: underline;
  text-align: center;
}

.forgot-password:hover {
  color: var(--primary-dark, #0056b3);
}

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.login-button {
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

.login-button:hover {
  background-color: var(--primary-dark, #0056b3);
}

.signup-link {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: var(--foreground, #333);
}

.signup-link-text {
  color: var(--primary, #007bff);
  cursor: pointer;
  text-decoration: underline;
  margin-left: 0.25rem;
}

.signup-link-text:hover {
  color: var(--primary-dark, #0056b3);
}

.logo {
  display: block;
  margin: 0 auto 1.5rem;
  width: 200px; /* Increased size for the logo */
}
`;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const session = await signIn(username, password);
      console.log("Sign in successful", session);
      
      if (session && session.AccessToken) {
        sessionStorage.setItem("accessToken", session.AccessToken);
  
        const apiKey = session.apiKey || 'dummy-api-key'; // Replace with actual retrieval logic
        sessionStorage.setItem("apiKey", apiKey);
        setUser({ username, apiKey });
  
        // Navigate to the dashboard and reload to ensure tables are fetched correctly
        navigate("/dashboard/EcoData");
        window.location.reload();  // Force a reload after navigating
      } else {
        console.error("SignIn session or AccessToken is undefined.");
        setError("Sign in failed. Please try again.");
      }
    } catch (error) {
      setError(`Sign in failed: ${error.message}`);
      console.error('Sign in error:', error);
    }
  };
  

  return (
    <>
      <GlobalStyle />
      <div className="login-container">
        <div className="login-wrapper">
          <img src="src/components/NewImages.png" alt="Logo" className="logo" />
          <form className="login-form" onSubmit={handleSignIn}>
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
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="login-button">
              Sign in
            </button>
          </form>
          <div className="signup-link">
            Don't have an account?
            <span
              className="signup-link-text"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </div>
          <div
            className="forgot-password"
            onClick={() => navigate("/forgotpassword")}
          >
            Forgot your password?
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;