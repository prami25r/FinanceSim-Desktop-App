import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchStocks = async () => {
      const res = await axios.get('http://localhost:4000/stocks/AAPL');
      setStocks(res.data);
    };
    fetchStocks();
  }, []);

  return (
    <div>
      <h1>Stock Market</h1>
      <p>{stocks.name} - {stocks.exchange}</p>
    </div>
  );
};

export default Dashboard;
