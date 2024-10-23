import React from 'react';

const ClearingAppIframe: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe
        src="https://clearing-qc3l3a-6y7b.vercel.app/"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        title="Clearing App"
      />
    </div>
  );
};

export default ClearingAppIframe;