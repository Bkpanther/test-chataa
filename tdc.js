import React, { useEffect, useState } from 'react';

const TopazSignaturePad = () => {
  const [status, setStatus] = useState('Checking device connection...');
  const [signature, setSignature] = useState(null);

  // Dynamically load the SigWeb script
  useEffect(() => {
    const loadSigWeb = () => {
      const script = document.createElement('script');
      script.src = '/sigwebtablet.js';
      script.onload = () => {
        console.log('SigWeb loaded successfully');
        checkDeviceConnection();
      };
      script.onerror = () => {
        console.error('Failed to load SigWeb');
        setStatus('Failed to load SigWeb');
      };
      document.body.appendChild(script);
    };

    loadSigWeb();
  }, []);

  // Check if the Topaz device is connected
  const checkDeviceConnection = () => {
    try {
      if (window.TabletConnectQuery && window.TabletConnectQuery() === 0) {
        setStatus('Topaz device is connected');
      } else {
        setStatus('Device not connected or SigWeb plugin missing');
      }
    } catch (error) {
      console.error('Error checking device connection:', error);
      setStatus('Error connecting to Topaz device');
    }
  };

  // Capture the signature from the Topaz device
  const handleCaptureSignature = () => {
    try {
      setStatus('Capturing signature...');
      window.ClearTablet();
      window.StartSign();

      setTimeout(() => {
        const capturedSignature = window.GetSigImageB64(0);
        if (capturedSignature) {
          setSignature(capturedSignature);
          setStatus('Signature captured successfully');
        } else {
          setStatus('No signature detected');
        }
      }, 5000); // Adjust timeout as necessary
    } catch (error) {
      console.error('Error capturing signature:', error);
      setStatus('Error capturing signature');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Topaz Signature Pad</h1>
      <p>Status: {status}</p>
      {status === 'Topaz device is connected' && (
        <button
          onClick={handleCaptureSignature}
          style={{ padding: '10px 20px', marginTop: '20px' }}
        >
          Capture Signature
        </button>
      )}
      {signature && (
        <div style={{ marginTop: '20px' }}>
          <h3>Captured Signature:</h3>
          <img
            src={`data:image/png;base64,${signature}`}
            alt="Captured Signature"
            style={{ border: '1px solid #000', padding: '10px' }}
          />
        </div>
      )}
    </div>
  );
};

export default TopazSignaturePad;
