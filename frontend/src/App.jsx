import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [anomalies, setAnomalies] = useState([]);

  // Function to fetch and filter database logs
  const fetchTelemetry = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/trades');
      const json = await response.json();
      
      if (json.success) {
        // Isolate only the trades flagged by your Python agent
        const flaggedTrades = json.data.filter(trade => trade.isFlagged === true);
        setAnomalies(flaggedTrades);
      }
    } catch (error) {
      console.error("Network Error: Cannot reach Node.js API", error);
    }
  };

  // useEffect triggers the fetch loop the moment the component mounts
  useEffect(() => {
    fetchTelemetry(); // Initial fetch
    const interval = setInterval(fetchTelemetry, 3000); // Poll every 3 seconds
    return () => clearInterval(interval); // Cleanup to prevent memory leaks
  }, []);

  return (
    <div className="dashboard">
      <h1>PostMortemAI: Active Anomalies</h1>
      <p>Live Surveillance Monitor</p>

      {anomalies.length === 0 ? (
        <p className="status-clear">No active anomalies detected.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'left', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Trade ID</th>
              <th>Symbol</th>
              <th>Price</th>
              <th>Volume</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {anomalies.map((trade) => (
              <tr key={trade._id} style={{ backgroundColor: '#ffcccc', color: '#900' }}>
                <td>{trade.tradeId}</td>
                <td><strong>{trade.symbol}</strong></td>
                <td>${trade.price}</td>
                <td>{trade.volume}</td>
                <td>{new Date(trade.timestamp).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;