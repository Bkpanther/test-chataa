
import React, { useState } from "react";
import { Modal, Image, Card } from "antd";

const UserMetadataBox = ({ metadata }) => (
  <Card
    style={{
      width: "fit-content",
      padding: "1px",
      border: "1px solid #000",
    }}
    bodyStyle={{ padding: 1 }}
  >
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      {Object.entries(metadata).map(([key, value]) => (
        <div
          key={key}
          style={{
            display: "flex",
            gap: "5px",
            alignItems: "center",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontWeight: "bold" }}>{key}:</span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  </Card>
);

const ImageModal = ({ visible, onClose }) => {
  const [zoomedImage, setZoomedImage] = useState(null);

  // Base64 Image Data (Replace with actual Base64 strings)
  const images = [
    {
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
      metadata: { Name: "Image 1", Size: "500KB", Format: "PNG" },
    },
    {
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
      metadata: { Name: "Image 2", Size: "1MB", Format: "JPEG" },
    },
  ];

  return (
    <>
      <Modal open={visible} onCancel={onClose} footer={null} centered width={600}>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
          {images.map((image, index) => (
            <div key={index} style={{ textAlign: "center" }}>
              <UserMetadataBox metadata={image.metadata} />
              <Image
                src={image.src}
                width={120}
                style={{ cursor: "pointer", marginTop: "10px" }}
                preview={{ visible: false }}
                onClick={() => setZoomedImage(image.src)}
              />
            </div>
          ))}
        </div>
      </Modal>

      {/* Zoomed Image Modal */}
      <Modal open={!!zoomedImage} onCancel={() => setZoomedImage(null)} footer={null} centered>
        <Image src={zoomedImage} width="100%" preview={false} />
      </Modal>
    </>
  );
};

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button onClick={() => setIsModalVisible(true)}>Open Modal</button>
      <ImageModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </div>
  );
};

export default App;
