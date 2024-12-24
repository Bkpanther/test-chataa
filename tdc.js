
import React, { useEffect, useState } from 'react';
import { Modal, Button, message } from 'antd';

const TopazSignaturePadAntd = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        message.error('Failed to load SigWeb script');
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
        message.success('Topaz device is connected');
      } else {
        setStatus('Device not connected or SigWeb plugin missing');
        message.warning('Device not connected or SigWeb plugin missing');
      }
    } catch (error) {
      console.error('Error checking device connection:', error);
      setStatus('Error connecting to Topaz device');
      message.error('Error connecting to Topaz device');
    }
  };

  // Capture the signature from the Topaz device
  const handleCaptureSignature = () => {
    try {
      setStatus('Capturing signature...');
      message.info('Capturing signature...');
      window.ClearTablet();
      window.StartSign();

      setTimeout(() => {
        const capturedSignature = window.GetSigImageB64(0);
        if (capturedSignature) {
          setSignature(capturedSignature);
          setStatus('Signature captured successfully');
          message.success('Signature captured successfully');
        } else {
          setStatus('No signature detected');
          message.warning('No signature detected');
        }
      }, 5000); // Adjust timeout as necessary
    } catch (error) {
      console.error('Error capturing signature:', error);
      setStatus('Error capturing signature');
      message.error('Error capturing signature');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Topaz Signature Pad with Ant Design Modal</h1>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Open Signature Pad
      </Button>

      <Modal
        title="Topaz Signature Pad"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>,
        ]}
      >
        <p>Status: {status}</p>
        {status === 'Topaz device is connected' && (
          <Button
            type="primary"
            onClick={handleCaptureSignature}
            style={{ marginTop: '20px' }}
          >
            Capture Signature
          </Button>
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
      </Modal>
    </div>
  );
};

export default TopazSignaturePadAntd;

