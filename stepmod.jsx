import React, { useState, useRef } from "react";
import { Modal, Button, Steps, Checkbox, Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

const { Step } = Steps;
const { Dragger } = Upload;

const StepsModal = () => {
    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState(0);
    const [completedSteps, setCompletedSteps] = useState({});
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [pdfToImage, setPdfToImage] = useState(null);
    const [cropper, setCropper] = useState(null);
    const cropperRef = useRef(null);
    const pdfCanvasRef = useRef(null);

    const steps = ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"];

    const handleNext = () => {
        if (current < steps.length - 1) setCurrent(current + 1);
    };

    const handlePrev = () => {
        if (current > 0) setCurrent(current - 1);
    };

    const handleStepCompletion = (e) => {
        setCompletedSteps({ ...completedSteps, [current]: e.target.checked });
    };

    const handleUploadChange = ({ file }) => {
        if (file.originFileObj) {
            const fileURL = URL.createObjectURL(file.originFileObj);
            const fileType = file.type;
            const uniqueKey = Date.now(); // Unique key to force re-render

            setUploadedFiles((prev) => ({
                ...prev,
                [current]: { name: file.name, url: fileURL, type: fileType, key: uniqueKey }
            }));

            message.success(`${file.name} uploaded successfully`);
        }
    };

    // Convert PDF to Image
    const capturePdfAsImage = () => {
        const canvas = pdfCanvasRef.current;
        if (canvas) {
            const image = canvas.toDataURL("image/png");
            setPdfToImage(image);
        }
    };

    // Crop Image
    const cropImage = () => {
        if (cropper) {
            const croppedImage = cropper.getCroppedCanvas().toDataURL();
            setPdfToImage(croppedImage);
            message.success("Image cropped successfully!");
        }
    };

    return (
        <>
            <Button type="primary" onClick={() => setVisible(true)}>Open Steps Modal</Button>
            <Modal title="Multi-Step Modal" open={visible} onCancel={() => setVisible(false)} footer={null}>
                <Steps direction="vertical" current={current}>
                    {steps.map((step, index) => (
                        <Step
                            key={index}
                            title={
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span>{step}</span>
                                    {index === current && (
                                        <Checkbox onChange={handleStepCompletion} checked={completedSteps[current]}>
                                            Mark as Complete
                                        </Checkbox>
                                    )}
                                </div>
                            }
                            status={completedSteps[index] ? "finish" : index < current ? "finish" : "wait"}
                        />
                    ))}
                </Steps>

                {/* File Upload Section */}
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <h3>Upload Image/PDF</h3>
                    <Dragger
                        name="file"
                        multiple={false}
                        accept=".jpg,.jpeg,.png,.pdf"
                        beforeUpload={() => false}
                        onChange={handleUploadChange}
                    >
                        <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                        <p className="ant-upload-text">Click or drag file to upload</p>
                    </Dragger>
                </div>

                {/* File Preview & Cropping Section */}
                {uploadedFiles[current] && (
                    <div key={uploadedFiles[current].key} style={{ marginTop: "20px", textAlign: "center" }}>
                        <h3>File Preview</h3>
                        {uploadedFiles[current].type === "application/pdf" ? (
                            <div style={{ border: "2px dashed #1890ff", padding: "10px", display: "inline-block" }}>
                                {/* Render PDF to Canvas */}
                                <Document
                                    file={uploadedFiles[current].url}
                                    onLoadSuccess={capturePdfAsImage} // Convert PDF to Image when loaded
                                >
                                    <Page pageNumber={1} width={300} canvasRef={pdfCanvasRef} />
                                </Document>
                            </div>
                        ) : (
                            <div style={{ border: "2px dashed #1890ff", padding: "10px", display: "inline-block" }}>
                                <Cropper
                                    key={uploadedFiles[current].key}
                                    src={uploadedFiles[current].url}
                                    style={{ height: 300, width: "100%" }}
                                    aspectRatio={1}
                                    guides={true}
                                    ref={cropperRef}
                                    onInitialized={(instance) => setCropper(instance)}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* PDF Cropped Image Preview */}
                {pdfToImage && (
                    <div style={{ marginTop: "20px", textAlign: "center" }}>
                        <h3>Cropped PDF as Image</h3>
                        <div style={{ border: "2px dashed #1890ff", padding: "10px", display: "inline-block" }}>
                            <Cropper
                                src={pdfToImage}
                                style={{ height: 300, width: "100%" }}
                                aspectRatio={1}
                                guides={true}
                                ref={cropperRef}
                                onInitialized={(instance) => setCropper(instance)}
                            />
                        </div>
                        <Button type="primary" onClick={cropImage} style={{ marginTop: 10 }}>
                            Crop Image
                        </Button>
                    </div>
                )}

                {/* Navigation buttons */}
                <div style={{ marginTop: "20px", textAlign: "right" }}>
                    {current > 0 && <Button style={{ marginRight: 8 }} onClick={handlePrev}>Previous</Button>}
                    {current < steps.length - 1 ? (
                        <Button type="primary" onClick={handleNext} disabled={!completedSteps[current] || !uploadedFiles[current]}>
                            Next
                        </Button>
                    ) : (
                        <Button type="primary" onClick={() => setVisible(false)} disabled={!completedSteps[current] || !uploadedFiles[current]}>
                            Finish
                        </Button>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default StepsModal;
