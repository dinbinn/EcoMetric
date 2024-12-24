// src/components/TableList.jsx
import React, { useState } from 'react';
import { getTables } from '../services/apiservice';
import styled from 'styled-components';

const Container = styled.div`
  padding: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  margin-right: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  color: white;
  background-color: #1E40AF;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1D4ED8;
  }
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  margin-bottom: 0.5rem;
`;

const TableList = () => {
  const [apiKey, setApiKey] = useState('');
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);

  const fetchTables = async () => {
    console.log("API Key:", apiKey); 
    try {
      const data = await getTables(apiKey);
      console.log("Response Data:", data); 
      setTables(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching tables:", err); 
      setError('Failed to fetch tables. Please check your API key and try again.');
      setTables([]);
    }
  };

  return (
    <Container>
      <Title>Fetch Tables from RDS</Title>
      <Input
        type="text"
        placeholder="Enter API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
      <Button onClick={fetchTables}>Fetch Tables</Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <List>
        {tables.length === 0 && !error && <p>No tables found.</p>}
        {tables.map((table, index) => (
          <ListItem key={index}>
            {table.table_schema}.{table.table_name}
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default TableList;
