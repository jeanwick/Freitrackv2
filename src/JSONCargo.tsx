import React, { useState } from 'react';
import axios from 'axios';

const JSONCargo: React.FC = () => {
  const [cargoData, setCargoData] = useState<any | null>(null);
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCargoData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:3001/api/proxy/jsoncargo/${trackingNumber}`);
      setCargoData(response.data); // Set the entire response data to state
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data from JSONCargo API');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber) {
      fetchCargoData();
    } else {
      setError('Please provide a tracking number');
    }
  };

  return (
    <div>
      <h3>JSONCargo Tracking</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="trackingNumber">Enter Tracking Number:</label>
        <input
          type="text"
          id="trackingNumber"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Track'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Print the raw JSON data if available */}
      {cargoData && (
        <pre>{JSON.stringify(cargoData, null, 2)}</pre>
      )}
    </div>
  );
};

export default JSONCargo;