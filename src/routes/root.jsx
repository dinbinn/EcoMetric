import React, { useEffect, useContext } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { UserContext } from "../context/userContext";
import Header from "../components/header";

const GlobalStyle = createGlobalStyle`
:root {
  --background: hsl(0, 0%, 100%);
  --foreground: hsl(240, 10%, 3.9%);
  --card: hsl(0, 0%, 100%);
  --card-foreground: hsl(240, 10%, 3.9%);
  --primary: hsl(240, 5.9%, 10%);
  --primary-foreground: hsl(0, 0%, 98%);
  --secondary: hsl(240, 4.8%, 95.9%);
  --secondary-foreground: hsl(240, 5.9%, 10%);
  --muted: hsl(240, 4.8%, 95.9%);
  --muted-foreground: hsl(240, 3.8%, 45%);
  --accent: hsl(240, 4.8%, 95.9%);
  --accent-foreground: hsl(240, 5.9%, 10%);
  --destructive: hsl(0, 72%, 51%);
  --destructive-foreground: hsl(0, 0%, 98%);
  --border: hsl(240, 5.9%, 90%);
  --input: hsl(240, 5.9%, 90%);
  --ring: hsl(240, 5.9%, 10%);
  --radius: 0.5rem;
}

* {
  border-color: var(--border);
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: 'YourDefaultBodyFont', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'YourDefaultHeadingFont', sans-serif;
}

html {
  box-sizing: border-box;
}
*,
*:before,
*:after {
  box-sizing: inherit;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}

html,
body {
  height: 100%;
  margin: 0;
  line-height: 1.5;
  color: #121212;
}

textarea, input, button {
  font-size: clamp(0.1rem, 1.2vw, 1rem);
  font-family: inherit;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  box-shadow: 0 0px 1px hsla(0, 0%, 0%, 0.2), 0 1px 2px hsla(0, 0%, 0%, 0.2);
  background-color: white;
  line-height: 1.5;
  margin: 0;
}

button {
  color: #3992ff;
  font-weight: 500;
}

#layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

#content {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
}

#sidebar {
  width: 250px; /* Fixed width for sidebar */
  background-color: #f7f7f7;
  border-right: 1px solid #e3e3e3;
  padding: 10px;
  display: flex;
  flex-direction: column;
  margin-top: 65px;
  position: fixed;
  height: calc(100vh - 80px);
  overflow-y: auto;
}

#detail {
  flex-grow: 1;
  padding: 1rem;
  background-color: #f9fafb;
  overflow-y: auto;
  margin-left: 250px; /* Match the sidebar width to avoid overlap */
  margin-top: 67px;
}

#sidebar > h1 {
  font-size: clamp(1.2rem, 1.15vw, 1.2rem);
  font-weight: 600;
  margin-bottom: 0.1vh;
  border-bottom: 1px solid #e3e3e3;
}

#sidebar nav ul {
  list-style: none;
  padding: 0;
}

#sidebar nav ul li {
  margin: 0.5rem 0;
}

#sidebar nav ul li a {
  padding: 1vh 1vh;
  display: block;
  text-decoration: none;
  color: var(--foreground);
  border-radius: 8px;
  font-size: clamp(1rem, 1.15vw, 1.3rem);
}

#sidebar nav ul li a:hover {
  background-color: hsl(240, 5.9%, 90%);
}

.section-title {
  font-size: clamp(1.3rem, 1.2vw, 1.65rem);
  font-weight: 500;
  padding-top: 0.5vh;
  padding-bottom: 0.5vh;
}

.logout-button {
  padding: 1rem;
  text-align: center;  
  margin-top: auto;
}

.logout-button button {
  font-size: clamp(1rem, 0.7vw, 2rem);
  background-color: var(--primary); /* Default background color */
  color: var(--primary-foreground); /* Default text color */
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

/* Add hover effect */
.logout-button button:hover {
  background-color: hsl(240, 5.9%, 20%); /* Darker shade of primary */
  color: hsl(0, 0%, 98%); /* Maintain high contrast text */
  transform: scale(1.05); /* Slightly enlarge button on hover */
}

/* Media Queries for Responsive Design */
@media (max-width: 768px) {
  #sidebar {
    position: fixed;
    width: 250px;
    margin-top: 65px;
    height: calc(100vh - 80px);
    overflow-y: auto;
  }

  #layout {
    flex-direction: column;
  }

  #detail {
    margin-left: 250px;
  }
}
`;

const parseJwt = (token) => {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
};

const Root = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (!sessionStorage.idToken || !sessionStorage.accessToken) {
      navigate("/login");
    } else {
      const accessToken = parseJwt(sessionStorage.accessToken.toString());
      sessionStorage.setItem('userSub', accessToken.sub);
      setUser(accessToken);
    }
  }, [navigate, setUser]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const noHeaderRoutes = ["/login", "/signup"];

  return (
    <>
      <GlobalStyle />
      <div id="layout">
        {!noHeaderRoutes.includes(location.pathname) && <Header />}
        <div id="content">
          <div id="sidebar">
            <nav>
              <div className="section-title">Eco Data</div>
              <ul>
                <li><Link to="/dashboard/EcoData">Eco Data</Link></li>
              </ul>
              <div className="section-title">My Reports</div>
              <ul>
              <li><Link to="/dashboard/coalreports">Coal Reports</Link></li>
                <li><Link to="/dashboard/co2">CO2 Emissions by Year</Link></li>
                <li><Link to="/dashboard/elec">Electricity Emissions by Year</Link></li>
                {/* <li><Link to="/dashboard/bop">Balance of Payments</Link></li> */}
              </ul>
              <div className="section-title">ESG Tracker</div>
              <ul>
                <li><Link to="/dashboard/emissiontracker">Track your emissions</Link></li>
                <li><Link to="/dashboard/trackermanager">Manage emissions</Link></li>
              </ul>
              <div className="section-title">Custom Requests</div>
              <ul>
                <li><Link to="/dashboard/custom-request">Request Custom Data</Link></li>
              </ul>
            </nav>
            <div className="logout-button">
              {sessionStorage.idToken && sessionStorage.accessToken ? (
                <button onClick={handleLogout}>Logout</button>
              ) : (
                <button onClick={() => navigate("/login")}>Login</button>
              )}
            </div>
          </div>
          <div id="detail">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Root;
