import React, { useState, useMemo, useReducer, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import './emissiontracker.css';

const API_BASE_URL = 'https://ma3la05bq1.execute-api.ap-southeast-1.amazonaws.com/Post/';

const emissionsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SCOPE3_RECORDS':
      return { ...state, scope3Records: action.payload };
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    case 'SET_SELECTED_YEAR':
      return { ...state, selectedYear: action.payload };
    case 'SET_SELECTED_SCOPE':
      return { ...state, selectedScope: action.payload };
    default:
      return state;
  }
};

const EmissionsTracker = () => {
  const initialState = {
    selectedCategory: 'All Categories',
    selectedYear: 'All Years',
    selectedScope: null,
    scope3Records: [],
  };

  const [state, dispatch] = useReducer(emissionsReducer, initialState);
  const { selectedCategory, selectedYear, scope3Records, selectedScope } = state;
  const [currentPage, setCurrentPage] = useState(1);
  const [scope1, setScope1] = useState('');
  const [scope2, setScope2] = useState('');
  const [scope3, setScope3] = useState('');
  const [scope3Category, setScope3Category] = useState('Purchased Goods and Services');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const recordsPerPage = 5;

  const scopeCategories = useMemo(() => [
    'All Categories',
    'Purchased Goods and Services',
    'Capital Goods',
    'Fuel and Energy',
    'Upstream Transportation and Distribution',
    'Waste Generated in Operations',
    'Business Travel',
    'Employee Commuting',
    'Upstream Leased Assets',
    'Downstream Transportation and Distribution',
    'Processing of Sold Products',
    'Use of Sold Products',
    'End-of-Life Treatment of Sold Products',
    'Downstream Leased Assets',
    'Franchises',
    'Investments'
  ], []);

  const fetchScope3Records = async () => {
    try {
      const userSub = sessionStorage.getItem('userSub');
      if (!userSub) throw new Error('userSub is missing or not set in sessionStorage');

      const response = await axios.get(`${API_BASE_URL}getScope3?user_id=${userSub}`);
      if (response.data && Array.isArray(response.data.records)) {
        dispatch({ type: 'SET_SCOPE3_RECORDS', payload: response.data.records });
      }
    } catch (error) {
      console.error('Error fetching Scope 3 records from backend:', error);
    }
  };

  const saveDataToRDS = async (data) => {
    try {
      const userSub = sessionStorage.getItem('userSub');
      if (!userSub) throw new Error('userSub is missing or not set in sessionStorage');

      await axios.post(`${API_BASE_URL}`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert('Data saved successfully!');
      fetchScope3Records();
    } catch (error) {
      console.error('Error saving data to RDS:', error);
      alert('Failed to save data.');
    }
  };

  useEffect(() => {
    fetchScope3Records();
  }, []);

  const handleSubmit = () => {
    const formattedTimestamp = `${year}-${String(month).padStart(2, '0')}`;

    const newScope3Record = {
      user_id: sessionStorage.getItem('userSub'),
      scope1: parseFloat(scope1),
      scope2: parseFloat(scope2),
      scope3: parseFloat(scope3),
      category: scope3Category,
      timestamp: formattedTimestamp,
    };

    saveDataToRDS(newScope3Record);

    setScope1('');
    setScope2('');
    setScope3('');
    setScope3Category('Purchased Goods and Services');
    setMonth('');
    setYear('');
  };
  const filteredByYear = useMemo(() => {
    let filtered = scope3Records;
    if (selectedYear !== 'All Years') {
      filtered = filtered.filter((record) => record.timestamp.startsWith(selectedYear));
    }
    return filtered;
  }, [scope3Records, selectedYear]);

  const filteredScope3Records = useMemo(() => {
    let filtered = filteredByYear;
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter((record) => record.category === selectedCategory);
    }
    return filtered;
  }, [filteredByYear, selectedCategory]);



  const cumulativeScopes = useMemo(() => {
    const scope1 = filteredByYear.reduce((total, record) => total + record.scope1, 0);
    const scope2 = filteredByYear.reduce((total, record) => total + record.scope2, 0);
    const scope3 = filteredScope3Records.reduce((total, record) => total + record.scope3, 0);
    return { scope1, scope2, scope3 };
  }, [filteredByYear, filteredScope3Records]);

  const groupedScope3ByMonth = useMemo(() => {
    const monthsMap = {};
  
    filteredScope3Records.forEach((record) => {
      const monthKey = record.timestamp.slice(0, 7);
      if (!monthsMap[monthKey]) {
        monthsMap[monthKey] = { scope3: 0 };
      }
      monthsMap[monthKey].scope3 += record.scope3;
    });
  
    return Object.entries(monthsMap)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  }, [filteredScope3Records]);

  const groupedByYear = useMemo(() => {
    const monthsMap = {};

    filteredByYear.forEach((record) => {
      const monthKey = record.timestamp.slice(0, 7);
      if (!monthsMap[monthKey]) {
        monthsMap[monthKey] = { scope1: 0, scope2: 0 };
      }
      monthsMap[monthKey].scope1 += record.scope1;
      monthsMap[monthKey].scope2 += record.scope2;
    });

    return Object.entries(monthsMap)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  }, [filteredByYear]);

  const uniqueYears = useMemo(() => {
    const years = [...new Set(scope3Records.map((record) => record.timestamp.slice(0, 4)))];
    return ['All Years', ...years];
  }, [scope3Records]);

  const currentRecords = useMemo(() => {
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    return filteredByYear.slice(indexOfFirstRecord, indexOfLastRecord);
  }, [filteredByYear, currentPage, recordsPerPage]);

  const totalPages = Math.ceil(filteredByYear.length / recordsPerPage);

  const barChartData = useMemo(() => ({
    labels: ['Scope 1', 'Scope 2', 'Scope 3'],
    datasets: [
      {
        data: [cumulativeScopes.scope1, cumulativeScopes.scope2, cumulativeScopes.scope3],
        backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f'],
      },
    ],
  }), [cumulativeScopes]);

  const lineChartData = useMemo(() => {
    const dataKey =
      selectedScope === 'Scope 1'
        ? 'scope1'
        : selectedScope === 'Scope 2'
        ? 'scope2'
        : 'scope3';
  
    const groupedData =
      selectedScope === 'Scope 3' ? groupedScope3ByMonth : groupedByYear;
  
    return {
      labels: groupedData.map((entry) => entry.month),
      datasets: [
        {
          label: `${selectedScope || 'Scope 3'} Emissions`,
          data: groupedData.map((entry) => entry[dataKey]),
          borderColor:
            selectedScope === 'Scope 1'
              ? '#3e95cd'
              : selectedScope === 'Scope 2'
              ? '#8e5ea2'
              : '#FFCE56',
          borderWidth: 2,
          fill: false,
        },
      ],
    };
  }, [groupedScope3ByMonth, groupedByYear, selectedScope]);
  

  const handleBarClick = (index) => {
    const scope = ['Scope 1', 'Scope 2', 'Scope 3'][index];
    dispatch({ type: 'SET_SELECTED_SCOPE', payload: scope });
  };

  const handleNextPage = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  const handlePreviousPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));


  return (
    <div className="tracker-container">
    <div className="emissions-form">
      <h1>Emissions Tracking</h1>
  
      <div className="input-card">
        <label>Scope 1 Emissions (Tons CO2e):</label>
        <input type="number" value={scope1} onChange={(e) => setScope1(e.target.value)} placeholder="0" min="0" step="0.1" />
      </div>
      <div className="input-card">
        <label>Scope 2 Emissions (Tons CO2e):</label>
        <input type="number" value={scope2} onChange={(e) => setScope2(e.target.value)} placeholder="0" min="0" step="0.1" />
      </div>
      <div className="input-card">
        <label>Scope 3 Emissions (Tons CO2e):</label>
        <input type="number" value={scope3} onChange={(e) => setScope3(e.target.value)} placeholder="0" min="0" step="0.1" />
      </div>
      <div className="input-card">
        <label>Scope 3 Category:</label>
        <select value={scope3Category} onChange={(e) => setScope3Category(e.target.value)}>
          {scopeCategories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="input-card-inline">
        <div className="input-half">
          <label>Month:</label>
          <input type="text" placeholder="MM" maxLength="2" value={month} onChange={(e) => setMonth(e.target.value)} />
        </div>
        <div className="input-half">
          <label>Year:</label>
          <input type="text" placeholder="YYYY" maxLength="4" value={year} onChange={(e) => setYear(e.target.value)} />
        </div>
      </div>
      <button className="submit-button" onClick={handleSubmit}>Submit</button>
  
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/dashboard/elecmix" style={{ color: '#007bff', textDecoration: 'underline' }}>
          View Electricity Mix Calculator
        </Link>
      </div>
    </div>
  
    <div className="emissions-summary">
      <div className="visualization-container">
        <div className="chart-container">
        <Bar
    data={{
      labels: ['Scope 1', 'Scope 2', 'Scope 3'], // Proper labels for the bars
      datasets: [
        {
          data: [cumulativeScopes.scope1, cumulativeScopes.scope2, cumulativeScopes.scope3],
          backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f'], // Bar colors
        },
      ],
    }}
    options={{
      responsive: true,
      maintainAspectRatio: false, // Ensure consistent sizing
      plugins: {
        legend: {
          display: false, // Disable the default legend
        },
        title: {
          display: true,
          text: 'Total Emissions (in Tons)',
          font: { size: 16 },
        },
      },
      scales: {
        x: {
          display: true,
          ticks: {
            font: {
              size: 14, // Font size for labels
            },
          },
          title: {
            display: false, // Hide the redundant x-axis title
          },
        },
        y: {
          title: {
            display: true,
            text: 'Emissions (Tons CO2e)',
            font: { size: 16 },
          },
        },
      },
      onClick: (_, elements) => {
        if (elements.length > 0) {
          const clickedIndex = elements[0].index;
          handleBarClick(clickedIndex);
        }
      },
    }}
  />
  <div className="legend-container">
    <div className="legend-item">
      <span className="legend-color" style={{ backgroundColor: '#3e95cd' }}></span>
      <span>Scope 1</span>
    </div>
    <div className="legend-item">
      <span className="legend-color" style={{ backgroundColor: '#8e5ea2' }}></span>
      <span>Scope 2</span>
    </div>
    <div className="legend-item">
      <span className="legend-color" style={{ backgroundColor: '#3cba9f' }}></span>
      <span>Scope 3</span>
    </div>
  </div>
</div>

  
        {selectedScope && (
          <div className="chart-container">
            {selectedScope === 'Scope 3' && (
              <div className="filter-container">
                <label>Filter by Category:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => dispatch({ type: 'SET_SELECTED_CATEGORY', payload: e.target.value })}
                >
                  {scopeCategories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            )}
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  title: {
                    display: true,
                    text: `Monthly ${selectedScope || 'Scope 3'} Emissions`, // Dynamically set the title
                    font: { size: '16vw' },
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Month (YYYY-MM)',
                      font: { size: 16 },
                      padding: { bottom: 10 }, // Add spacing above the label
                    },
                    ticks: {
                      padding: 10, // Add spacing between ticks and the x-axis
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Emissions (Tons CO2e)',
                      font: { size: 16 },
                    },
                  },
                },
              }}
            />
          </div>
        )}
      </div>
  
      <div className="year-filter">
        <label>Filter by Year:</label>
        <select
          value={selectedYear}
          onChange={(e) => dispatch({ type: 'SET_SELECTED_YEAR', payload: e.target.value })}
        >
          {uniqueYears.map((year, index) => (
            <option key={index} value={year}>{year}</option>
          ))}
        </select>
      </div>
  
      <div className="record-table">
        <h3>Scope 1, 2, and 3 Entries</h3>
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Scope 1</th>
              <th>Scope 2</th>
              <th>Scope 3</th>
              <th>Scope 3 Category</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.timestamp.slice(0, 7)}</td>
                <td>{record.scope1}</td>
                <td>{record.scope2}</td>
                <td>{record.scope3}</td>
                <td>{record.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination-controls">
          <button disabled={currentPage === 1} onClick={handlePreviousPage}>Previous</button>
          <span> Page {currentPage} of {totalPages} </span>
          <button disabled={currentPage === totalPages} onClick={handleNextPage}>Next</button>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default EmissionsTracker;
