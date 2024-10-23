import React, { useState } from 'react';
import axios from 'axios';

interface TrackingEvent {
  eventID: string;
  carrierBookingReference: string;
  [key: string]: any;
}

interface ServiceSchedule {
  voyageNumber: string;
  vesselName: string;
  originPort: string;
  destinationPort: string;
  eta: string;
  etd: string;
}

const Tracking: React.FC = () => {
  const [containerNumber, setContainerNumber] = useState<string>(''); // Container number input
  const [carrierBookingReference, setCarrierBookingReference] = useState<string>(''); // Carrier booking reference input
  const [trackingData, setTrackingData] = useState<any>(null); // Hapag-Lloyd tracking data
  const [serviceScheduleData, setServiceScheduleData] = useState<any>(null); // Service schedules
  const [originPort, setOriginPort] = useState<string>(''); // Origin Port input for service schedules
  const [destinationPort, setDestinationPort] = useState<string>(''); // Destination Port input for service schedules
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Hapag-Lloyd tracking data
  const fetchTrackingData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('https://mock.api-portal.hlag.com/v2/events/', {
        params: {
          carrierBookingReference,
          equipmentReference: containerNumber,
        },
        headers: {
          accept: 'application/json',
          'API-Version': '1',
          'X-IBM-Client-Id': 'ba98473d-1a01-4c9e-8036-99d6d07504ac',
          'X-IBM-Client-Secret': '3xL8Q~g5Acm_eQM1jnbO0fxVgd~EYP~FDf3L3bhV',
        },
      });
      setTrackingData(response.data); // Set Hapag-Lloyd tracking data
    } catch (err) {
      setError('Failed to fetch tracking data from Hapag-Lloyd API');
    } finally {
      setLoading(false);
    }
  };

  // Fetch service schedules data from Hapag-Lloyd API
  const fetchServiceSchedules = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('https://mock.api-portal.hlag.com/v3/service-schedules', {
        params: {
          originPort, // Origin Port from input
          destinationPort, // Destination Port from input
        },
        headers: {
          accept: 'application/json',
          'API-Version': '1',
          'X-IBM-Client-Id': 'ba98473d-1a01-4c9e-8036-99d6d07504ac',
          'X-IBM-Client-Secret': '4-K8Q~cPS1GCB9EweLF3y8IO3raR9onVReeWCbFE',
        },
      });

      setServiceScheduleData(response.data); // Set service schedules data
    } catch (err) {
      setError('Failed to fetch service schedules from Hapag-Lloyd API');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for Hapag-Lloyd tracking
  const handleTrackingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (containerNumber && carrierBookingReference) {
      fetchTrackingData(); // Fetch Hapag-Lloyd tracking data
    } else {
      setError('Please provide both container number and carrier booking reference');
    }
  };

  // Handle form submission for service schedules
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (originPort && destinationPort) {
      fetchServiceSchedules(); // Fetch service schedules
    } else {
      setError('Please provide both origin and destination ports');
    }
  };

  return (
    <div>
      {/* <h2>Carrier and JSONCargo Tracking</h2> */}

      {/* Form for Hapag-Lloyd tracking API */}
      <form onSubmit={handleTrackingSubmit}>
        <div>
          <label>Container Number:</label>
          <input
            type="text"
            value={containerNumber}
            onChange={(e) => setContainerNumber(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Carrier Booking Reference:</label>
          <input
            type="text"
            value={carrierBookingReference}
            onChange={(e) => setCarrierBookingReference(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Track Carrier'}
        </button>
      </form>

      {/* Form for service schedules */}
      <h3>Service Schedules</h3>
      <form onSubmit={handleScheduleSubmit}>
        <div>
          <label>Origin Port:</label>
          <input
            type="text"
            value={originPort}
            onChange={(e) => setOriginPort(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Destination Port:</label>
          <input
            type="text"
            value={destinationPort}
            onChange={(e) => setDestinationPort(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Schedules'}
        </button>
      </form>

      {/* Error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display Hapag-Lloyd tracking data as JSON */}
      {trackingData && (
        <div>
          <h3>Tracking Data</h3>
          <pre>{JSON.stringify(trackingData, null, 2)}</pre> {/* Display JSON response */}
        </div>
      )}

      {/* Display Service Schedules data as JSON */}
      {serviceScheduleData && (
        <div>
          <h3>Service Schedules</h3>
          <pre>{JSON.stringify(serviceScheduleData, null, 2)}</pre> {/* Display JSON response */}
        </div>
      )}
    </div>
  );
};

export default Tracking;