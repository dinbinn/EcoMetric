import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './coalreports.css';

const CoalReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://ma3la05bq1.execute-api.ap-southeast-1.amazonaws.com/Post/getReport');
        setReports(response.data.reports);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to fetch reports. Please try again later.');
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const downloadReport = async (id, fileName) => {
    try {
      const response = await fetch(
        `https://ma3la05bq1.execute-api.ap-southeast-1.amazonaws.com/Post/downloadReport?id=${id}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        throw new Error('Failed to download report');
      }

      const base64Data = await response.text();
      const binaryData = atob(base64Data);
      const arrayBuffer = new Uint8Array(binaryData.length).map((_, i) =>
        binaryData.charCodeAt(i)
      );
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const filteredReports = reports
    .filter((report) =>
      report.report_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.report_description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === 'newest'
        ? new Date(b.report_date) - new Date(a.report_date)
        : new Date(a.report_date) - new Date(b.report_date)
    );

  return (
    <div className="coal-reports-container">
      <header className="coal-reports-header">
        <h1>Coal Reports</h1>
        <div className="coal-reports-filters">
          <input
            type="text"
            placeholder="Search reports..."
            className="coal-reports-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="coal-reports-sort"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </header>

      {loading && <p>Loading reports...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && filteredReports.length === 0 && (
        <p>No reports match your search.</p>
      )}

      <div className="coal-reports-list">
        {filteredReports.map((report) => (
          <div key={report.id} className="coal-report-card">
            <h3>{report.report_title}</h3>
            <p>{report.report_description}</p>
            <p>
              <strong>Date:</strong> {new Date(report.report_date).toLocaleDateString()}
            </p>
            <button
              onClick={() => downloadReport(report.id, report.file_name)}
              className="coal-report-download-btn"
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoalReports;
