import React, { useState } from "react";
import CryptoJS from "crypto-js";

const ImageEncryptorDecryptor = () => {
  const [encryptedData, setEncryptedData] = useState(null); // Encrypted image data
  const [decryptedImage, setDecryptedImage] = useState(""); // Decrypted image URL
  const [encryptionKey, setEncryptionKey] = useState(""); // Encryption key
  const [iv, setIV] = useState(""); // Initialization Vector (IV)
  const [loading, setLoading] = useState(false); // Loading state

  // Encrypt image buffer using AES
  const encryptImage = (imageBuffer) => {
    const key = CryptoJS.lib.WordArray.random(256 / 8); // 256-bit key
    const iv = CryptoJS.lib.WordArray.random(128 / 8); // 128-bit IV

    // Encrypt the image buffer
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.lib.WordArray.create(imageBuffer), // Convert buffer to WordArray
      key,
      { iv }
    );

    // Return encrypted data, key, and IV
    return {
      encryptedData: encrypted.toString(),
      key: key.toString(),
      iv: iv.toString(),
    };
  };

  // Decrypt image buffer using AES
  const decryptImage = (encryptedData, key, iv) => {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Hex.parse(key), {
      iv: CryptoJS.enc.Hex.parse(iv),
    });

    // Convert decrypted data to a Uint8Array
    const decryptedBuffer = new Uint8Array(decrypted.words);
    return decryptedBuffer;
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    setLoading(true);
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const arrayBuffer = e.target.result; // Get the file as ArrayBuffer
      const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer); // Convert to WordArray

      // Encrypt the image
      const { encryptedData, key, iv } = encryptImage(wordArray);

      // Save encrypted data, key, and IV to the database (mock implementation)
      await saveToDatabase({ encryptedData, key, iv });

      // Update state
      setEncryptedData(encryptedData);
      setEncryptionKey(key);
      setIV(iv);
      setLoading(false);
    };

    reader.readAsArrayBuffer(file); // Read the file as ArrayBuffer
  };

  // Mock database save function
  const saveToDatabase = async (data) => {
    console.log("Saving to database:", data);
    // Replace with actual API call to your backend
    // Example: await axios.post('/api/images', data);
  };

  // Handle image decryption
  const handleDecryptImage = async () => {
    setLoading(true);

    // Fetch encrypted data, key, and IV from the database (mock implementation)
    const dbData = await fetchFromDatabase();

    // Decrypt the image
    const decryptedBuffer = decryptImage(dbData.encryptedData, dbData.key, dbData.iv);

    // Convert decrypted buffer to a Blob and create a URL for the image
    const blob = new Blob([decryptedBuffer], { type: "image/jpeg" });
    const imageUrl = URL.createObjectURL(blob);

    // Update state with the decrypted image URL
    setDecryptedImage(imageUrl);
    setLoading(false);
  };

  // Mock database fetch function
  const fetchFromDatabase = async () => {
    // Replace with actual API call to your backend
    return {
      encryptedData,
      key: encryptionKey,
      iv,
    };
  };

  return (
    <div>
      <h1>Image Encryption and Decryption</h1>

      {/* File upload input */}
      <input type="file" onChange={handleFileUpload} disabled={loading} />

      {loading && <p>Processing...</p>}

      {/* Decrypt and display image */}
      {encryptedData && (
        <div>
          <h2>Encrypted Data Stored</h2>
          <button onClick={handleDecryptImage} disabled={loading}>
            Decrypt and Display Image
          </button>
        </div>
      )}

      {/* Display decrypted image */}
      {decryptedImage && (
        <div>
          <h2>Decrypted Image</h2>
          <img src={decryptedImage} alt="Decrypted" style={{ maxWidth: "500px" }} />
        </div>
      )}
    </div>
  );
};

export default ImageEncryptorDecryptor;
