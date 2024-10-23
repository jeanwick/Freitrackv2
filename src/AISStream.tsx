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
  'Durban': [[-38.88, 31.03], [-20.88, 42.74]],
  'Cape Town': [[-33.895056, 18.410718], [-34.013399, 18.452209]],
  'Port Elizabeth': [[-34.017609, 25.612232], [-33.964904, 25.689558]],
};

// Utility function to check if a ship is within a bounding box
const isShipInBoundingBox = (ship: ShipData, boundingBox: BoundingBox): boolean => {
  const [southWest, northEast] = boundingBox;
  return (
    ship.lat >= southWest[0] && ship.lat <= northEast[0] && // Latitude in range
    ship.lon >= southWest[1] && ship.lon <= northEast[1]    // Longitude in range
  );
};

// Define the props for AISStream
interface AISStreamProps {
  mapRef?: React.RefObject<HTMLDivElement>; // Optional mapRef prop
}

const AISStream: React.FC<AISStreamProps> = ({ mapRef }) => {
  const [ships, setShips] = useState<Record<string, ShipData>>({});
  const [status, setStatus] = useState<string>('Disconnected');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [selectedPort, setSelectedPort] = useState<string>('Durban'); // Track selected port
  const [shipCountPerPort, setShipCountPerPort] = useState<Record<string, number>>({
    'Durban': 0,
    'Cape Town': 0,
    'Port Elizabeth': 0,
  });

  // Fetch ship data from the backend API
  const fetchShipData = async () => {
    try {
      setStatus('Connecting...');
      const response = await axios.get('https://websocket-ais-streamv2.vercel.app/api/ships');
      
      console.log('API Response:', response.data); // Monitor API response

      // Filter out ships with lat/lon of 0,0
      const validShips = response.data.data.filter((ship: ShipData) =>
        ship.lat !== 0 && ship.lon !== 0
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

      // Calculate ship count per port
      const updatedShipCount: Record<string, number> = {
        'Durban': 0,
        'Cape Town': 0,
        'Port Elizabeth': 0,
      };

      validShips.forEach((ship: ShipData) => {
        Object.keys(portBoundingBoxes).forEach((port) => {
          if (isShipInBoundingBox(ship, portBoundingBoxes[port])) {
            updatedShipCount[port] += 1;
          }
        });
      });

      setShipCountPerPort(updatedShipCount);

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
  const selectedBoundingBox = portBoundingBoxes[selectedPort];

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

      {/* Display shipment count for each port */}
      <div>
        <p><strong>Durban:</strong> {shipCountPerPort['Durban']} ships</p>
        <p><strong>Cape Town:</strong> {shipCountPerPort['Cape Town']} ships</p>
        <p><strong>Port Elizabeth:</strong> {shipCountPerPort['Port Elizabeth']} ships</p>
      </div>

      <div ref={mapRef} style={{ height: '500px', width: '100%' }}>
        <MapContainer center={[-29.85, 31.05]} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Render all bounding boxes on the map */}
          {Object.values(portBoundingBoxes).map((boundingBox, index) => (
            <Rectangle
              key={index}
              bounds={boundingBox}
              pathOptions={{ color: 'red', weight: 2 }}
            />
          ))}

          {/* Highlight selected bounding box */}
          <Rectangle bounds={selectedBoundingBox} pathOptions={{ color: 'blue', weight: 3 }} />

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