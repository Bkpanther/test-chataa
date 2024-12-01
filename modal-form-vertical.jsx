
import React, { useState, useRef } from "react";
import { Button, Steps, message, Upload, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const { Step } = Steps;

const MultiPageModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [crop, setCrop] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState("");

  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  const instructions = [
    "Step 1: Read this instruction.",
    "Step 2: Acknowledge this step.",
    "Step 3: Understand the information provided.",
    "Step 4: Provide consent for the final steps.",
    "Step 5: Upload and crop your image.",
  ];

  const stepMessages = [
    "Do you agree to the instructions in Step 1?",
    "Are you ready to proceed after Step 2?",
    "Have you understood the details in Step 3?",
    "Do you consent to continue to the final steps?",
    "Ready to upload and crop your image?",
  ];

  const rejectionMessages = [
    "You need to review and agree with Step 1 instructions before proceeding.",
    "Please confirm your readiness for Step 2 before moving forward.",
    "Review and ensure understanding of the details in Step 3 before continuing.",
    "You must provide consent to proceed with the final steps.",
    "Please confirm your readiness to upload and crop your image.",
  ];

  const handleNext = () => {
    setCustomMessage(stepMessages[currentStep]);
    setConsentModalOpen(true);
  };

  const handleConfirmNext = () => {
    setConsentModalOpen(false);
    if (currentStep < instructions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      message.success("You have completed all steps!");
    }
  };

  const handleRejectNext = () => {
    setConsentModalOpen(false);
    message.error(rejectionMessages[currentStep]);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handlePrint = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Print Form</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1, p { margin: 10px 0; }
            </style>
          </head>
          <body>
            <h1>Print Form</h1>
            <p>This is an example form that you can print.</p>
            <p>Instructions for each step can be shown here.</p>
            <p>Step 1: Read and acknowledge the information before proceeding.</p>
            <p>Step 2: Confirm your understanding.</p>
            <p>Step 3: Provide consent to proceed.</p>
            <p>Step 4: Upload your image as per the requirements.</p>
            <p>Step 5: Crop and review your image before submission.</p>
          </body>
        </html>
      `);
      newWindow.document.close();
      newWindow.print();
    }
  };

  const generatePreview = (crop) => {
    if (!imageRef.current || !crop.width || !crop.height) return;

    const canvas = canvasRef.current;
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
    const ctx = canvas.getContext("2d");

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      imageRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    const previewURL = canvas.toDataURL("image/png");
    setPreviews((prev) => [...prev, previewURL]);
  };

  const handleTakeSnip = () => {
    if (completedCrop && completedCrop.width && completedCrop.height) {
      generatePreview(completedCrop);
    }
  };

  const handleSubmit = () => {
    console.log("Submitted Previews:", previews);
    message.success("e-Sign image submitted successfully!");
    setIsModalOpen(false);
    setCurrentStep(0);
    setUploadedFile(null);
    setPreviews([]);
    setCrop(null);
  };

  return (
    <div style={{ padding: "20px", textAlign: "right" }}>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Add e-Sign Image
      </Button>

      <Modal
        title="Add e-Sign Image"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button disabled={currentStep === 0} onClick={handlePrevious}>
              Previous
            </Button>
            <Button
              disabled={currentStep === instructions.length - 1}
              type="primary"
              onClick={handleNext}
            >
              Next
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={currentStep !== instructions.length - 1 || previews.length < 2}
            >
              Submit
            </Button>
          </div>
        }
      >
        <Steps direction="vertical" current={currentStep} style={{ marginBottom: "20px" }}>
          {instructions.map((instruction, index) => (
            <Step
              key={index}
              title={`Step ${index + 1}`}
              description={
                <div>
                  <p>{instruction}</p>
                  {index === 0 && currentStep === 0 && (
                    <Button
                      type="default"
                      onClick={handlePrint}
                      style={{ marginTop: "10px" }}
                    >
                      Print Form
                    </Button>
                  )}
                  {index === instructions.length - 1 && currentStep === index && (
                    <>
                      <Upload
                        accept=".jpg,.png"
                        beforeUpload={(file) => {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setUploadedFile(e.target.result);
                            setPreviews([]);
                            setCrop(null);
                          };
                          reader.readAsDataURL(file);
                          return false;
                        }}
                      >
                        <Button icon={<UploadOutlined />}>Upload File</Button>
                      </Upload>
                      {uploadedFile && (
                        <div style={{ marginTop: "16px" }}>
                          <ReactCrop
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c)}
                          >
                            <img
                              ref={imageRef}
                              src={uploadedFile}
                              alt="Uploaded"
                              style={{ maxWidth: "100%" }}
                            />
                          </ReactCrop>
                          <Button
                            type="primary"
                            style={{ marginTop: "16px" }}
                            onClick={handleTakeSnip}
                            disabled={!completedCrop || previews.length >= 2}
                          >
                            Take Snip
                          </Button>
                          <canvas ref={canvasRef} style={{ display: "none" }} />
                          {previews.length > 0 && (
                            <div style={{ marginTop: "16px" }}>
                              <h4>Snaps:</h4>
                              {previews.map((preview, index) => (
                                <div key={index} style={{ marginBottom: "8px" }}>
                                  <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    style={{
                                      maxWidth: "100%",
                                      border: "1px solid #ccc",
                                      marginBottom: "4px",
                                    }}
                                  />
                                  <a href={preview} download={`preview-${index + 1}.png`}>
                                    <Button type="primary" size="small">
                                      Download Snap {index + 1}
                                    </Button>
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              }
            />
          ))}
        </Steps>
      </Modal>

      <Modal
        title="User Consent"
        open={consentModalOpen}
        onOk={handleConfirmNext}
        onCancel={handleRejectNext}
        okText="Yes"
        cancelText="No"
      >
        <p>{customMessage}</p>
      </Modal>
    </div>
  );
};

export default MultiPageModal;
