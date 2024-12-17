import React, { useState } from 'react';

// Assumed composition of Vietnam's electricity mix
const electricityMix = [
  { source: 'Coal', percentage: 56.9 },
  { source: 'Hydro', percentage: 18.9 },
  { source: 'Renewables (Solar & Wind)', percentage: 13.7 },
  { source: 'Natural Gas', percentage: 8.6 },
  { source: 'Imported Electricity', percentage: 1.7 },
];

const ElectricityMixCalculator = () => {
  const [electricityUsage, setElectricityUsage] = useState('');
  const [carbonEmissions, setCarbonEmissions] = useState(null);

  const handleCalculate = () => {
    if (!electricityUsage || isNaN(electricityUsage) || electricityUsage <= 0) {
      alert('Please enter a valid electricity usage in kWh.');
      return;
    }

    const emissionFactor = 0.6766; // tCO₂ per MWh
    const usageInMWh = electricityUsage / 1000; // Convert kWh to MWh
    const estimatedEmissions = usageInMWh * emissionFactor; // Calculate emissions in tCO₂

    setCarbonEmissions(estimatedEmissions.toFixed(2));
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.heading}>Carbon Emissions Calculator</h1>

        <div style={styles.mixContainer}>
          <h3>Electricity Mix Composition</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.headerCell}>Source</th>
                <th style={styles.headerCell}>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {electricityMix.map((source, index) => (
                <tr key={index}>
                  <td style={styles.cell}>{source.source}</td>
                  <td style={styles.cell}>{source.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={styles.inputContainer}>
          <h2>Calculate Your Carbon Emissions</h2>
          <label>Enter your electricity usage (kWh):</label>
          <p style={styles.subtext}>Calculated based on Vietnam Emission Factor from 2022 data:</p>
          <input
            type="number"
            value={electricityUsage}
            onChange={(e) => setElectricityUsage(e.target.value)}
            placeholder="e.g. 100kWh"
            style={styles.input}
          />
          <div style={styles.buttonContainer}>
            <button onClick={handleCalculate} style={styles.button}>
              Calculate
            </button>
          </div>
        </div>

        {carbonEmissions !== null && (
          <div style={styles.result}>
            <h3 style={styles.resultHeading}>Estimated Carbon Emissions:</h3>
            <p style={styles.resultText}>{carbonEmissions} tCO₂</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'top',
    height: '110%',
    backgroundColor: '#f0f4f8',
  },
  content: {
    marginTop: '20px',
    width: '90%',
    maxWidth: '600px',
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    height: 'max-content',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '28px',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
  },
  mixContainer: {
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  headerCell: {
    textAlign: 'left',
    fontWeight: 'bold',
    padding: '8px',
    borderBottom: '1px solid #ddd',
  },
  cell: {
    textAlign: 'left',
    padding: '8px',
    borderBottom: '1px solid #ddd',
  },
  inputContainer: {
    marginTop: '20px',
  },
  subtext: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '10px',
    fontWeight: 'normal', // Ensures it's not bold
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    marginTop: '10px',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  buttonHover: {
    backgroundColor: '#388e3c',
  },
  result: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#e8f5e9', // Light green background
    borderRadius: '8px',
    border: '1px solid #4caf50', // Green border for clarity
  },
  resultHeading: {
    margin: '0 0 10px',
    color: '#2e7d32', // Darker green
    fontWeight: 'bold',
    fontSize: '18px',
  },
  resultText: {
    fontSize: '16px',
    color: '#333',
    margin: 0,
  },
};

export default ElectricityMixCalculator;
