import React from 'react';

const PowerBIReport: React.FC = () => {
  return (
    <div>
      {/* <h2>Power BI Report</h2> */}
      <iframe
        title="Power BI Report"
        width="100%"
        height="600"
        src="https://app.powerbi.com/view?r=eyJrIjoiMzJkNmM2MTQtNWM4ZC00YWRiLTgxMzItNjg1OWE1NmM3YmU0IiwidCI6IjE0ZWY5OGE4LTI4ZmYtNDQ1Zi1iN2Y1LTFjMDcxY2I5ZmM4NiIsImMiOjh9"
        frameBorder="0"
        allowFullScreen={true}
      ></iframe>
    </div>
  );
};

export default PowerBIReport;