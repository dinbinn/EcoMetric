// src/components/envcheck.jsx
import React from 'react';

const EnvCheck = () => {
  console.log("API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
  console.log("API_KEY:", import.meta.env.VITE_API_KEY);
  return (
    <div>
      Check the console for environment variables.
    </div>
  );
};

export default EnvCheck;
