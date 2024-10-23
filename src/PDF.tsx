import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Props {
  mapRef: React.RefObject<HTMLDivElement>;  // Define mapRef as a prop
  trackingData: any;  // Add tracking data as a prop
  jsonCargoData: any; // Add JSONCargo data as a prop
  shipsGoData: any;   // Add ShipsGo data as a prop
}

const AISMapWithPDF: React.FC<Props> = ({ mapRef, trackingData, jsonCargoData, shipsGoData }) => {
  // Function to generate the PDF
  const generatePDF = async () => {
    const mapElement = mapRef.current;
    const pdf = new jsPDF();

    if (mapElement) {
      const canvas = await html2canvas(mapElement);
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 100);  // Add the AIS map image
    }

    // Add Hapag-Lloyd tracking data
    pdf.text('Hapag-Lloyd Tracking Data:', 10, 120);
    if (trackingData) {
      pdf.text(`Event ID: ${trackingData.eventID || 'N/A'}`, 10, 130);
      pdf.text(`Booking Reference: ${trackingData.carrierBookingReference || 'N/A'}`, 10, 140);
    } else {
      pdf.text('No tracking data available', 10, 130);
    }

    // Add JSONCargo data
    pdf.text('JSONCargo Data:', 10, 160);
    if (jsonCargoData && jsonCargoData.data) {
      pdf.text(`Container ID: ${jsonCargoData.data.container_id || 'N/A'}`, 10, 170);
      pdf.text(`Status: ${jsonCargoData.data.container_status || 'N/A'}`, 10, 180);
      pdf.text(`Last Location: ${jsonCargoData.data.last_location || 'N/A'}`, 10, 190);
    } else {
      pdf.text('No JSONCargo data available', 10, 170);
    }

    // Add ShipsGo data
    pdf.text('ShipsGo Data:', 10, 210);
    if (shipsGoData) {
      pdf.text(`Container: ${shipsGoData.containerNumber || 'N/A'}`, 10, 220);
      pdf.text(`Shipping Line: ${shipsGoData.shippingLine || 'N/A'}`, 10, 230);
    } else {
      pdf.text('No ShipsGo data available', 10, 220);
    }

    // Save the generated PDF
    pdf.save('ais_map_and_data.pdf');
  };

  return (
    <div>
      <button onClick={generatePDF} style={{ marginTop: '20px', padding: '10px', backgroundColor: 'green', color: 'white', cursor: 'pointer' }}>
        Generate PDF
      </button>
    </div>
  );
};

export default AISMapWithPDF;