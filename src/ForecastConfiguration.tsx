import React, { useState, useEffect } from 'react';
import axios from 'axios';

type PortCode = 'ZADUR' | 'ZAZBA' | 'ZACPT';

interface EtaCalculatorParams {
  vessel: {
    imo: number;
  };
  arrival: {
    portCode: PortCode;
  };
}

const ForecastConfiguration: React.FC = () => {
  // Congestion API state
  const [congestionPort, setCongestionPort] = useState<PortCode | ''>('');
  const [congestionData, setCongestionData] = useState<any>(null);
  const [portDelays, setPortDelays] = useState<number>(0);

  // ETA API state
  const [etaPort, setEtaPort] = useState<PortCode | ''>('');
  const [imo, setImo] = useState<number | ''>('');
  const [etaData, setEtaData] = useState<any>(null); // Store full ETA API response
  const [error, setError] = useState<string | null>(null);

  // Fetch Congestion Data
  useEffect(() => {
    const fetchCongestionData = async () => {
      if (!congestionPort) return;

      try {
        const response = await axios.get(
          'https://api.sinay.ai/congestion/api/v1/congestion',
          {
            headers: {
              API_KEY: '6aee23aa-0a6e-4cf7-b801-3a88290c1c51',
              'Content-Type': 'application/json',
            },
            params: { portCode: congestionPort },
          }
        );

        setCongestionData(response.data); // Store API response in state
      } catch (error) {
        console.error('Error fetching API congestion data:', error);
      }
    };

    fetchCongestionData();
  }, [congestionPort]);

  useEffect(() => {
    if (congestionData) {
      const congestion = congestionData.congestion || 0;
      setPortDelays(congestion);
    }
  }, [congestionData]);

  // Call ETA calculator API
  const calculateEta = async (params: EtaCalculatorParams) => {
    try {
      const response = await axios.post(
        'https://api.sinay.ai/etac/api/v1/compute-eta', // Correct API endpoint
        {
          vessel: {
            imo: params.vessel.imo,
          },
          arrival: {
            portCode: params.arrival.portCode,
          },
        },
        {
          headers: {
            'API_KEY': '6aee23aa-0a6e-4cf7-b801-3a88290c1c51', // API key in headers
            'Content-Type': 'application/json',
          },
        }
      );
      setEtaData(response.data); // Store full ETA API response
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error response from API:', error.response?.data);
        setError('Failed to fetch ETA data');
      } else {
        console.error('Unknown error:', error);
        setError('An unknown error occurred');
      }
    }
  };

  const handleCalculateEta = () => {
    if (imo && etaPort) {
      calculateEta({ vessel: { imo: Number(imo) }, arrival: { portCode: etaPort } });
    } else {
      setError('Please enter valid IMO and select a port.');
    }
  };

  return (
    <div>
      <h1>Forecast Configuration</h1>

      {/* Congestion Port Dropdown */}
      <label>Port of Discharge (Congestion):</label>
      <select
        value={congestionPort}
        onChange={(e) => setCongestionPort(e.target.value as PortCode)}
      >
        <option value="">Select a Port</option>
        <option value="ZADUR">Durban (ZADUR)</option>
        <option value="ZAZBA">Coega (ZAZBA)</option>
        <option value="ZACPT">Cape Town (ZACPT)</option>
      </select>

      <div>
        <label>Port Capacity (%):</label>
        <input type="number" value={portDelays} readOnly />
      </div>

      {congestionData && (
        <div>
          <h3>Congestion API Response</h3>
          <pre>{JSON.stringify(congestionData, null, 2)}</pre> {/* Display entire congestion API response */}
        </div>
      )}

      {/* ETA Calculator Form */}
      <div>
        <h2>ETA Calculator</h2>
        <div>
          <label>IMO (Vessel):</label>
          <input
            type="number"
            value={imo}
            onChange={(e) => setImo(e.target.value ? Number(e.target.value) : '')}
            placeholder="Enter IMO number"
          />
        </div>

        {/* ETA Port Dropdown */}
        <label>Port of Discharge (ETA):</label>
        <select
          value={etaPort}
          onChange={(e) => setEtaPort(e.target.value as PortCode)}
        >
          <option value="">Select a Port</option>
          <option value="ZADUR">Durban (ZADUR)</option>
          <option value="ZAZBA">Coega (ZAZBA)</option>
          <option value="ZACPT">Cape Town (ZACPT)</option>
        </select>

        <button onClick={handleCalculateEta}>Calculate ETA</button>

        {etaData && (
          <div>
            <h3>ETA API Response</h3>
            <pre>{JSON.stringify(etaData, null, 2)}</pre> {/* Display entire ETA API response */}
          </div>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default ForecastConfiguration;