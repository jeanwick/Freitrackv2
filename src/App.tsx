import React, { useRef } from 'react';
import AISStream from './AISStream';
import ForecastConfiguration from './ForecastConfiguration';
import Tracking from './Tracking';
import PowerBIReport from './PowerBI';
import AISMapWithPDF from './PDF'; // Import PDF component
import NestedDataTable from './NestedDataTable'; // Import the new component
import './App.css'; // Import custom CSS for better styling
import ClearingAppIframe from './CI';
import JsonCargo from './JSONCargo';


const App: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null); // Create a ref for the map

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Freitrack Real-Time Container, Vessel & Port Insights</h1>
        <nav className="app-nav">
          {/* <ul>
            <li><a href="#ais-stream">AIS Stream</a></li>
            <li><a href="#congestion">Port Congestion</a></li>
            <li><a href="#tracking">Tracking</a></li>
            <li><a href="#powerbi">PowerBI Report</a></li>
            <li><a href="#pdf">Generate PDF</a></li>
            <li><a href="#schedule-data">Vessel Schedule Data</a></li>
          </ul> */}
        </nav>
      </header>

      <main>

      <section id="powerbi" className="card">
          <h2>PowerBI Report</h2>
          <PowerBIReport />
        </section>

        <section id="ais-stream" className="card">
          <h2>AIS Stream</h2>
          <AISStream /> {/* Pass the ref to AISStream */}
        </section>

        <section id="congestion" className="card">
          <h2>Port Congestion and Lead Time Prediction</h2>
          <ForecastConfiguration />
        </section>

        <section id="tracking" className="card">
          <h2>Carrier and JSONCargo Tracking</h2>
          <Tracking />
          <JsonCargo/>
        </section>

        {/* Add the NestedDataTable component */}
        <section id="schedule-data" className="card">
          <h2>TPT Terminal Updates</h2>
          <NestedDataTable />
        </section>
                {/* Pass mapRef to the PDF generator component */}
                <section id="pdf" className="card">
          <h2>Generate PDF</h2>
          <AISMapWithPDF mapRef={mapRef} trackingData={undefined} jsonCargoData={undefined} shipsGoData={undefined} />
        </section>
        {/* <div>
        <ClearingAppIframe/>
    </div> */}
      </main>

      <footer className="app-footer">
        <p>© 2024 Freitrack. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;