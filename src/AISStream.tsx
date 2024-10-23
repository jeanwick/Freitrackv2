import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Rectangle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Type for ship data
type ShipData = {
  mmsi: string;
  lat: number;
  lon: number;
  speed: number;
  course: number;
  timestamp: string;
};

// Type for bounding boxes
type BoundingBox = [[number, number], [number, number]];

// Define port bounding boxes
const portBoundingBoxes: Record<string, BoundingBox> = {
  // 'Durban': [[-29.7205, 30.8762], [-29.9626, 31.0822]],
  'Durban':[[-38.88, 31.03], [-20.88, 42.74] ],
  'Cape Town': [[-33.895056, 18.410718], [-34.013399, 18.452209]],
  'Port Elizabeth': [[-34.017609, 25.612232], [-33.964904, 25.689558]],
};

const AISStream: React.FC<{ mapRef: React.RefObject<HTMLDivElement> }> = ({ mapRef }) => {
  const [ships, setShips] = useState<Record<string, ShipData>>({});
  const [status, setStatus] = useState<string>('Disconnected');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [selectedPort, setSelectedPort] = useState<string>('Durban'); // Track selected port

  // Fetch ship data from the backend API
  const fetchShipData = async () => {
    try {
      setStatus('Connecting...');
      const response = await axios.get('https://websocket-ais-streamv2.vercel.app/api/ships');
      
      console.log('API Response:', response.data); // Added console.log to monitor API response

      const validShips = response.data.filter((ship: ShipData) =>
        ship.lat !== undefined && ship.lon !== undefined
      );

      if (validShips.length === 0) {
        console.warn('No valid ship data received.');
        setStatus('No Ships Available');
        return;
      }

      const updatedShips: Record<string, ShipData> = {};
      validShips.forEach((ship: ShipData) => {
        updatedShips[ship.mmsi] = ship;
      });

      setShips(updatedShips);
      setStatus('Connected');
    } catch (err) {
      console.error('Error fetching ship data:', err);
      setErrorDetails('Failed to load ship data.');
      setStatus('Error');
    }
  };

  useEffect(() => {
    fetchShipData();
  }, []);

  // Get bounding box based on the selected port
  const boundingBox = portBoundingBoxes[selectedPort];

  return (
    <div>
      <h2>AIS Stream - Status: {status}</h2>
      {errorDetails && <p style={{ color: 'red' }}>{errorDetails}</p>}

      <label>Select Port: </label>
      <select
        value={selectedPort}
        onChange={(e) => setSelectedPort(e.target.value)}
      >
        <option value="Durban">Durban</option>
        <option value="Cape Town">Cape Town</option>
        <option value="Port Elizabeth">Port Elizabeth</option>
      </select>

      <div ref={mapRef} style={{ height: '500px', width: '100%' }}>
        <MapContainer center={[-29.85, 31.05]} zoom={10} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Draw the bounding box around the selected port */}
          <Rectangle bounds={boundingBox} pathOptions={{ color: 'red' }} />

          {/* Display each ship as a CircleMarker */}
          {Object.values(ships).map((ship) => (
            <CircleMarker
              key={ship.mmsi}
              center={[ship.lat, ship.lon]}
              radius={5}
              color="blue"
              fillColor="blue"
              fillOpacity={1}
            >
              <Popup>
                <div>
                  <p><strong>MMSI:</strong> {ship.mmsi}</p>
                  <p><strong>Speed:</strong> {ship.speed} knots</p>
                  <p><strong>Course:</strong> {ship.course}°</p>
                  <p><strong>Timestamp:</strong> {ship.timestamp}</p> {/* Display timestamp */}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default AISStream;