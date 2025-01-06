
import React, { useEffect, useState } from 'react';
import { Modal, Button, Upload, message, Steps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Step } = Steps;

const TopazSignaturePadModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [status, setStatus] = useState('Checking device connection...');
  const [signature, setSignature] = useState(null);
  const [initial, setInitial] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

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

  const checkDeviceConnection = () => {
    try {
      const connectionStatus = window.TabletConnectQuery();
      if (parseInt(connectionStatus, 10) === 0) {
        setStatus('Device online');
      } else {
        setStatus('Device not connected or SigWeb plugin missing');
      }
    } catch (error) {
      console.error('Error checking device connection:', error);
      setStatus('Error connecting to Topaz device');
    }
  };

  const handleCapture = () => {
    try {
      const canvas = document.getElementById('signatureCanvas');
      if (!canvas) {
        setStatus('Canvas element not found. Ensure the canvas element is rendered before capturing.');
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setStatus('Failed to get canvas context. Verify the canvas element is accessible.');
        return;
      }

      setStatus('Please sign on the device or use your mouse to sign.');

      canvas.onmousedown = (e) => {
        const rect = canvas.getBoundingClientRect();
        const startX = e.clientX - rect.left;
        const startY = e.clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(startX, startY);

        canvas.onmousemove = (event) => {
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          ctx.lineTo(x, y);
          ctx.stroke();
        };
      };

      canvas.onmouseup = () => {
        canvas.onmousemove = null;
      };
    } catch (error) {
      console.error('Error capturing data:', error);
      setStatus('Error capturing data');
    }
  };

  const handleClearCanvas = () => {
    const canvas = document.getElementById('signatureCanvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setStatus('Canvas cleared.');
      }
    }
  };

  const handleSaveCanvas = () => {
    const canvas = document.getElementById('signatureCanvas');
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      console.log('Canvas Data URL:', dataUrl);
      message.success('Canvas data saved as Base64 format.');
    }
  };

  const handleImageUpload = (info) => {
    if (info.file.status === 'done') {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (currentStep === 0) {
          setSignature(e.target.result);
          setStatus('Signature uploaded successfully. Proceed to upload or capture initials.');
        } else if (currentStep === 1) {
          setInitial(e.target.result);
          setStatus('Initials uploaded successfully.');
        }
      };
      reader.readAsDataURL(info.file.originFileObj);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 2));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentStep(0);
    setSignature(null);
    setInitial(null);
    setUploadedImage(null);
    setStatus('Process canceled.');
  };

  const handleSaveAsDraft = () => {
    message.info('Your progress has been saved as a draft.');
  };

  const handleSubmit = () => {
    message.success('Your submission has been successfully completed.');
    setIsModalVisible(false);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Open Signature Pad
      </Button>
      <Modal
        title="Topaz Signature Pad"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Steps direction="vertical" current={currentStep} style={{ marginBottom: '20px' }}>
          <Step 
            title="Capture/Upload Signature" 
            description={
              signature ? (
                <img
                  src={signature}
                  alt="Signature"
                  style={{ border: '1px solid #000', marginTop: '10px', width: '100px', height: '50px' }}
                />
              ) : 'Provide your signature.'
            }
          />
          <Step 
            title="Capture/Upload Initials" 
            description={
              initial ? (
                <img
                  src={initial}
                  alt="Initials"
                  style={{ border: '1px solid #000', marginTop: '10px', width: '100px', height: '50px' }}
                />
              ) : 'Provide your initials.'
            }
          />
          <Step title="Complete" description="Finalize the process." />
        </Steps>
        <p>Status: {status}</p>
        <canvas
          id="signatureCanvas"
          style={{ border: '1px solid #000', marginTop: '20px', width: '400px', height: '200px' }}
        ></canvas>
        {currentStep < 2 && (
          <div>
            <Button type="primary" onClick={handleCapture} style={{ marginTop: '20px', marginRight: '10px' }}>
              {currentStep === 0 ? 'Capture Signature' : 'Capture Initials'}
            </Button>
            <Button onClick={handleClearCanvas} style={{ marginTop: '20px', marginRight: '10px' }}>
              Clear Canvas
            </Button>
            <Button onClick={handleSaveCanvas} style={{ marginTop: '20px' }}>
              Save Canvas
            </Button>
            <Upload
              accept="image/*"
              showUploadList={false}
              customRequest={({ file, onSuccess }) => {
                setTimeout(() => {
                  onSuccess('ok');
                }, 0);
              }}
              onChange={handleImageUpload}
            >
              <Button icon={<UploadOutlined />} style={{ marginTop: '20px' }}>
                {currentStep === 0 ? 'Upload Signature' : 'Upload Initials'}
              </Button>
            </Upload>
          </div>
        )}
        <div style={{ marginTop: '20px' }}>
          <Button onClick={handlePrev} disabled={currentStep === 0} style={{ marginRight: '10px' }}>
            Previous
          </Button>
          <Button onClick={handleNext} disabled={currentStep === 2} style={{ marginRight: '10px' }}>
            Next
          </Button>
          <Button onClick={handleSaveAsDraft} style={{ marginRight: '10px' }}>
            Save as Draft
          </Button>
          <Button type="primary" onClick={handleSubmit} disabled={currentStep < 2}>
            Submit
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TopazSignaturePadModal;
