import React, { useState, useContext, useEffect } from 'react';
import { getTables, getTableContents } from '../services/apiservice';
import { UserContext } from "../context/userContext";

const APIKeys = () => {
    const { user } = useContext(UserContext);
    const [tables, setTables] = useState([]);
    const [tableContents, setTableContents] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const data = await getTables();
                setTables(data || []);
                setError('');
            } catch (error) {
                console.error('Error fetching tables:', error);
                setError('Failed to fetch tables. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, []);

    const fetchTableContents = async (tableName) => {
        const table = tables.find(t => t.table_name === tableName);
        if (table?.access_level !== 'full') {
            setError('You do not have access to view this table content.');
            return;
        }

        try {
            const data = await getTableContents(tableName);
            setTableContents(data || []);
            setSelectedTable(tableName);
            setError('');
        } catch (error) {
            setError('Failed to fetch table contents. Please try again.');
        }
    };

    const formatTableName = (tableName) => {
        return tableName.replace(/^api_data\./, '').replace(/_/g, ' ');
    };

    const downloadTableContent = () => {
        const csvRows = [];
        const headers = Object.keys(tableContents[0]).map(key => key.replace(/_/g, ' '));
        csvRows.push(headers.join(','));

        tableContents.forEach(row => {
            const values = Object.values(row).map(value => {
                return `"${value !== null ? value.toString().replace(/"/g, '""') : 'N/A'}"`;
            });
            csvRows.push(values.join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${formatTableName(selectedTable)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div style={styles.container}>
            <div style={styles.mainContent}>
                {/* Available Tables Section */}
                <div style={{ ...styles.tableList, width: selectedTable ? '25%' : '100%' }}>
                    <h2 style={styles.sectionTitle}>Available Tables</h2>

                    {loading ? (
                        <p style={styles.loadingText}>Loading tables...</p>
                    ) : (
                        <>
                            {error && <p style={styles.errorText}>{error}</p>}
                            <div style={styles.scrollableList}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.tableHeader}>Dataset Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tables.length > 0 ? (
                                            tables.map((table, index) => {
                                                const tableName = formatTableName(table.table_name);
                                                const isAccessible = table.access_level === 'full';
                                                return (
                                                    <tr 
                                                        key={index} 
                                                        onClick={isAccessible ? () => fetchTableContents(table.table_name) : null}
                                                        style={{ 
                                                            ...styles.tableRow, 
                                                            cursor: isAccessible ? 'pointer' : 'not-allowed',
                                                            backgroundColor: selectedTable === table.table_name ? '#e0f7fa' : 'transparent'
                                                        }}
                                                        onMouseEnter={e => isAccessible ? e.currentTarget.style.backgroundColor = '#f1f1f1' : null}
                                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = selectedTable === table.table_name ? '#e0f7fa' : 'transparent'}
                                                    >
                                                        <td style={styles.tableCell}>
                                                            {tableName}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td style={styles.noDataCell}>No tables found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
                
                {/* Table Content Section */}
                {selectedTable && (
                    <div style={styles.tableContent}>
                        <h2 style={styles.sectionTitle}>{formatTableName(selectedTable)}</h2>
                        
                        {tableContents.length > 0 ? (
                            <div style={styles.contentScroll}>
                                <table style={styles.table}>
                                    <thead style={{ position: 'sticky', top: '0', zIndex: 10 }}>
                                        <tr>
                                            {Object.keys(tableContents[0]).map((key, index) => (
                                                <th key={index} style={styles.tableHeader}>
                                                    {key.replace(/_/g, ' ')}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableContents.map((row, index) => (
                                            <tr key={index}>
                                                {Object.keys(row).map((key, subIndex) => (
                                                    <td key={subIndex} style={styles.tableCell}>
                                                        {row[key] !== null ? row[key].toString() : 'N/A'}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p style={styles.noDataText}>No table contents found.</p>
                        )}
                        
                        <button 
                            onClick={downloadTableContent}
                            style={styles.downloadButton}
                            disabled={tableContents.length === 0}
                        >
                            Download CSV
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default APIKeys;

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#f4f8f9',
        width: '100%'
    },
    mainContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '1400px',
    },
    tableList: {
        border: '1px solid #e0e0e0',
        padding: '20px',
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
        transition: 'width 0.3s ease',
    },
    sectionTitle: {
        fontSize: '24px',
        marginBottom: '20px',
        textAlign: 'center',
        color: '#007bff',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: '16px',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    scrollableList: {
        height: '450px',
        overflowY: 'scroll',
        marginTop: '10px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
    },
    tableHeader: {
        borderBottom: '3px solid #007bff',
        padding: '12px',
        fontSize: '18px',
        backgroundColor: '#e9f5ff',
        color: '#007bff',
    },
    tableRow: {
        transition: 'background-color 0.3s ease',
    },
    tableCell: {
        padding: '12px',
        borderBottom: '1px solid #f0f0f0',
        fontSize: '16px',
    },
    noDataCell: {
        padding: '10px',
        textAlign: 'center',
        fontSize: '16px',
    },
    tableContent: {
        flex: 3,
        border: '1px solid #e0e0e0',
        padding: '20px',
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        marginLeft: '5%',
        transition: 'flex 0.3s ease',
    },
    contentScroll: {
        overflowX: 'auto',
        overflowY: 'auto',
        maxHeight: '400px',
    },
    downloadButton: {
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
    noDataText: {
        textAlign: 'center',
        fontSize: '16px',
    },
};
