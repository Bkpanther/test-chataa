// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


// import React, { useState, useRef, useEffect } from "react";
// import * as pdfjsLib from "pdfjs-dist";

// // Set up PDF.js worker
// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

// const PDFSnipper = () => {
//   const canvasRef = useRef(null);
//   const [pdfFile, setPdfFile] = useState(null);
//   const [selection, setSelection] = useState(null); // Stores the selection area
//   const [startPos, setStartPos] = useState(null);

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const fileReader = new FileReader();
//       fileReader.onload = (e) => setPdfFile(e.target.result);
//       fileReader.readAsDataURL(file);
//     }
//   };

//   useEffect(() => {
//     if (!pdfFile) return;

//     const loadPdf = async () => {
//       const pdf = await pdfjsLib.getDocument(pdfFile).promise;
//       const page = await pdf.getPage(1); // Load the first page
//       const viewport = page.getViewport({ scale: 1.5 });
//       const canvas = canvasRef.current;
//       const context = canvas.getContext("2d");

//       canvas.width = viewport.width;
//       canvas.height = viewport.height;

//       const renderContext = {
//         canvasContext: context,
//         viewport: viewport,
//       };

//       await page.render(renderContext).promise;
//     };

//     loadPdf();
//   }, [pdfFile]);

//   const handleMouseDown = (e) => {
//     const rect = e.target.getBoundingClientRect();
//     setStartPos({
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     });
//   };

//   const handleMouseUp = (e) => {
//     const rect = e.target.getBoundingClientRect();
//     const endPos = {
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     };
//     setSelection({
//       x: Math.min(startPos.x, endPos.x),
//       y: Math.min(startPos.y, endPos.y),
//       width: Math.abs(startPos.x - endPos.x),
//       height: Math.abs(startPos.y - endPos.y),
//     });
//     setStartPos(null);
//   };

//   const handleMouseMove = (e) => {
//     if (!startPos) return;
//     const rect = e.target.getBoundingClientRect();
//     const currentPos = {
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     };
//     setSelection({
//       x: Math.min(startPos.x, currentPos.x),
//       y: Math.min(startPos.y, currentPos.y),
//       width: Math.abs(startPos.x - currentPos.x),
//       height: Math.abs(startPos.y - currentPos.y),
//     });
//   };

//   const cropSelection = () => {
//     if (!selection) return;

//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");

//     const croppedCanvas = document.createElement("canvas");
//     const croppedContext = croppedCanvas.getContext("2d");

//     croppedCanvas.width = selection.width;
//     croppedCanvas.height = selection.height;

//     croppedContext.drawImage(
//       canvas,
//       selection.x,
//       selection.y,
//       selection.width,
//       selection.height,
//       0,
//       0,
//       selection.width,
//       selection.height
//     );

//     const croppedImage = croppedCanvas.toDataURL("image/png");
//     console.log("Cropped Image:", croppedImage); // Base64 image
//     alert("Cropped image saved as Base64 string. Check the console!");
//   };

//   return (
//     <div>
//       <h2>Upload and Snip a PDF</h2>
//       <input type="file" accept="application/pdf" onChange={handleFileUpload} />
//       <br />
//       <canvas
//         ref={canvasRef}
//         onMouseDown={handleMouseDown}
//         onMouseUp={handleMouseUp}
//         onMouseMove={handleMouseMove}
//         style={{ border: "1px solid black", cursor: "crosshair", marginTop: "20px" }}
//       />
//       {selection && (
//         <div>
//           <p>Selected Area:</p>
//           <pre>{JSON.stringify(selection, null, 2)}</pre>
//           <button onClick={cropSelection}>Crop Selection</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PDFSnipper;

// import React, { useRef, useState } from "react";
// import * as pdfjsLib from "pdfjs-dist";

// // Configure PDF.js worker
// pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// const PDFSnipper = () => {
//   const [pdfFile, setPdfFile] = useState(null);
//   const canvasRef = useRef(null);
//   const [selection, setSelection] = useState(null); // Stores the snip selection
//   const [startPosition, setStartPosition] = useState(null);

//   // Handle file upload
//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => setPdfFile(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   // Render the PDF to the canvas
//   React.useEffect(() => {
//     if (!pdfFile) return;

//     const renderPDF = async () => {
//       const pdf = await pdfjsLib.getDocument(pdfFile).promise;
//       const page = await pdf.getPage(1); // Render the first page
//       const viewport = page.getViewport({ scale: 1.5 });

//       const canvas = canvasRef.current;
//       const context = canvas.getContext("2d");
//       canvas.width = viewport.width;
//       canvas.height = viewport.height;

//       const renderContext = {
//         canvasContext: context,
//         viewport,
//       };

//       await page.render(renderContext).promise;
//     };

//     renderPDF();
//   }, [pdfFile]);

//   // Mouse events for drawing the snip rectangle
//   const handleMouseDown = (e) => {
//     const rect = canvasRef.current.getBoundingClientRect();
//     setStartPosition({
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     });
//     setSelection(null);
//   };

//   const handleMouseMove = (e) => {
//     if (!startPosition) return;

//     const rect = canvasRef.current.getBoundingClientRect();
//     const currentPosition = {
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     };

//     setSelection({
//       x: Math.min(startPosition.x, currentPosition.x),
//       y: Math.min(startPosition.y, currentPosition.y),
//       width: Math.abs(currentPosition.x - startPosition.x),
//       height: Math.abs(currentPosition.y - startPosition.y),
//     });
//   };

//   const handleMouseUp = () => {
//     setStartPosition(null);
//   };

//   // Crop the selected portion
//   const cropSelection = () => {
//     if (!selection) return;

//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");

//     const croppedCanvas = document.createElement("canvas");
//     const croppedContext = croppedCanvas.getContext("2d");

//     croppedCanvas.width = selection.width;
//     croppedCanvas.height = selection.height;

//     croppedContext.drawImage(
//       canvas,
//       selection.x,
//       selection.y,
//       selection.width,
//       selection.height,
//       0,
//       0,
//       selection.width,
//       selection.height
//     );

//     const croppedImage = croppedCanvas.toDataURL("image/png");
//     console.log("Cropped Image:", croppedImage); // Log or use the cropped image
//     alert("Snipped image created. Check the console for Base64 output.");
//   };

//   return (
//     <div>
//       <h1>PDF Snipper</h1>
//       <input type="file" accept="application/pdf" onChange={handleFileUpload} />
//       {pdfFile && (
//         <>
//           <div style={{ position: "relative", marginTop: "20px" }}>
//             <canvas
//               ref={canvasRef}
//               onMouseDown={handleMouseDown}
//               onMouseMove={handleMouseMove}
//               onMouseUp={handleMouseUp}
//               style={{ border: "1px solid black", cursor: "crosshair" }}
//             />
//             {selection && (
//               <div
//                 style={{
//                   position: "absolute",
//                   border: "2px dashed red",
//                   background: "rgba(255, 0, 0, 0.2)",
//                   top: `${selection.y}px`,
//                   left: `${selection.x}px`,
//                   width: `${selection.width}px`,
//                   height: `${selection.height}px`,
//                   pointerEvents: "none",
//                 }}
//               />
//             )}
//           </div>
//           <button onClick={cropSelection} style={{ marginTop: "10px" }}>
//             Crop Snip
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default PDFSnipper;

// import React, { useRef, useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css";


// // Configure pdf.js worker
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// const PDFSnipper = () => {
//   const [pdfFile, setPdfFile] = useState(null); // Stores the uploaded PDF
//   const [pageNumber, setPageNumber] = useState(1); // Current page number
//   const [numPages, setNumPages] = useState(null); // Total number of pages
//   const canvasRef = useRef(null);
//   const [selection, setSelection] = useState(null);
//   const [startPosition, setStartPosition] = useState(null);

//   // Handle file upload
//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setPdfFile(file);
//     }
//   };

//   // On document load success, set the number of pages
//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//     setPageNumber(1); // Reset to the first page
//   };

//   // Render the snipping area on top of the canvas
//   const handleMouseDown = (e) => {
//     const rect = canvasRef.current.getBoundingClientRect();
//     setStartPosition({
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     });
//     setSelection(null);
//   };

//   const handleMouseMove = (e) => {
//     if (!startPosition) return;

//     const rect = canvasRef.current.getBoundingClientRect();
//     const currentPosition = {
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     };

//     setSelection({
//       x: Math.min(startPosition.x, currentPosition.x),
//       y: Math.min(startPosition.y, currentPosition.y),
//       width: Math.abs(currentPosition.x - startPosition.x),
//       height: Math.abs(currentPosition.y - startPosition.y),
//     });
//   };

//   const handleMouseUp = () => {
//     setStartPosition(null);
//   };

//   // Crop the selected area
//   const cropSelection = () => {
//     if (!selection || !canvasRef.current) return;

//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");

//     const croppedCanvas = document.createElement("canvas");
//     const croppedContext = croppedCanvas.getContext("2d");

//     croppedCanvas.width = selection.width;
//     croppedCanvas.height = selection.height;

//     croppedContext.drawImage(
//       canvas,
//       selection.x,
//       selection.y,
//       selection.width,
//       selection.height,
//       0,
//       0,
//       selection.width,
//       selection.height
//     );

//     const croppedImage = croppedCanvas.toDataURL("image/png");
//     console.log("Cropped Image:", croppedImage);
//     alert("Snip created! Check console for Base64 output.");
//   };

//   return (
//     <div>
//       <h1>PDF Snipper with react-pdf</h1>
//       <input type="file" accept="application/pdf" onChange={handleFileUpload} />

//       {pdfFile && (
//         <div>
//           <Document
//             file={pdfFile}
//             onLoadSuccess={onDocumentLoadSuccess}
//             renderMode="canvas"
//           >
//             <Page
//               pageNumber={pageNumber}
//               canvasRef={(canvas) => {
//                 if (canvas) {
//                   canvasRef.current = canvas;
//                 }
//               }}
//               onMouseDown={handleMouseDown}
//               onMouseMove={handleMouseMove}
//               onMouseUp={handleMouseUp}
//               renderInteractiveForms={false}
//             />
//           </Document>

//           <div>
//             <button
//               onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
//               disabled={pageNumber <= 1}
//             >
//               Previous
//             </button>
//             <span>
//               Page {pageNumber} of {numPages}
//             </span>
//             <button
//               onClick={() =>
//                 setPageNumber((prev) => Math.min(prev + 1, numPages))
//               }
//               disabled={pageNumber >= numPages}
//             >
//               Next
//             </button>
//           </div>

//           {selection && (
//             <div
//               style={{
//                 position: "absolute",
//                 border: "2px dashed red",
//                 background: "rgba(255, 0, 0, 0.2)",
//                 top: `${selection.y}px`,
//                 left: `${selection.x}px`,
//                 width: `${selection.width}px`,
//                 height: `${selection.height}px`,
//                 pointerEvents: "none",
//               }}
//             />
//           )}

//           <button onClick={cropSelection} style={{ marginTop: "10px" }}>
//             Crop Snip
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PDFSnipper;
// import React, { useRef, useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css"; // Ensure TextLayer styles are imported
// import 'react-pdf/dist/Page/TextLayer.css';
// // Configure pdf.js worker
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
// const PDFSnipper = () => {
//   const [pdfFile, setPdfFile] = useState(null); // Stores the uploaded PDF
//   const [pageNumber, setPageNumber] = useState(1); // Current page number
//   const [numPages, setNumPages] = useState(null); // Total number of pages
//   const canvasRef = useRef(null);
//   const [selection, setSelection] = useState(null);
//   const [startPosition, setStartPosition] = useState(null);

//   // Handle file upload
//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setPdfFile(file);
//     }
//   };

//   // On document load success, set the number of pages
//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//     setPageNumber(1); // Reset to the first page
//   };

//   // Mouse events for drawing the snip rectangle
//   const handleMouseDown = (e) => {
//     const rect = canvasRef.current.getBoundingClientRect();
//     setStartPosition({
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     });
//     setSelection(null);
//   };

//   const handleMouseMove = (e) => {
//     if (!startPosition) return;

//     const rect = canvasRef.current.getBoundingClientRect();
//     const currentPosition = {
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     };

//     setSelection({
//       x: Math.min(startPosition.x, currentPosition.x),
//       y: Math.min(startPosition.y, currentPosition.y),
//       width: Math.abs(currentPosition.x - startPosition.x),
//       height: Math.abs(currentPosition.y - startPosition.y),
//     });
//   };

//   const handleMouseUp = () => {
//     setStartPosition(null);
//   };

//   // Crop the selected area
//   const cropSelection = () => {
//     if (!selection || !canvasRef.current) return;

//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");

//     const croppedCanvas = document.createElement("canvas");
//     const croppedContext = croppedCanvas.getContext("2d");

//     croppedCanvas.width = selection.width;
//     croppedCanvas.height = selection.height;

//     croppedContext.drawImage(
//       canvas,
//       selection.x,
//       selection.y,
//       selection.width,
//       selection.height,
//       0,
//       0,
//       selection.width,
//       selection.height
//     );

//     const croppedImage = croppedCanvas.toDataURL("image/png");
//     console.log("Cropped Image:", croppedImage);
//     alert("Snip created! Check console for Base64 output.");
//   };

//   return (
//     <div>
//       <h1>PDF Snipper with react-pdf</h1>
//       <input type="file" accept="application/pdf" onChange={handleFileUpload} />

//       {pdfFile && (
//         <div>
//           <Document
//             file={pdfFile}
//             onLoadSuccess={onDocumentLoadSuccess}
//           >
//             <Page
//               pageNumber={pageNumber}
//               canvasRef={(canvas) => {
//                 if (canvas) {
//                   canvasRef.current = canvas;
//                 }
//               }}
//               renderMode="svg"  // Use "svg" to render the TextLayer properly
//               onMouseDown={handleMouseDown}
//               onMouseMove={handleMouseMove}
//               onMouseUp={handleMouseUp}
//             />
//           </Document>

//           <div>
//             <button
//               onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
//               disabled={pageNumber <= 1}
//             >
//               Previous
//             </button>
//             <span>
//               Page {pageNumber} of {numPages}
//             </span>
//             <button
//               onClick={() =>
//                 setPageNumber((prev) => Math.min(prev + 1, numPages))
//               }
//               disabled={pageNumber >= numPages}
//             >
//               Next
//             </button>
//           </div>

//           {selection && (
//             <div
//               style={{
//                 position: "absolute",
//                 border: "2px dashed red",
//                 background: "rgba(255, 0, 0, 0.2)",
//                 top: `${selection.y}px`,
//                 left: `${selection.x}px`,
//                 width: `${selection.width}px`,
//                 height: `${selection.height}px`,
//                 pointerEvents: "none",
//               }}
//             />
//           )}

//           <button onClick={cropSelection} style={{ marginTop: "10px" }}>
//             Crop Snip
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PDFSnipper;

import React, { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css"; // Ensure TextLayer styles are imported
import "react-pdf/dist/Page/TextLayer.css"; // Ensure TextLayer CSS is loaded
// Configure pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFSnipper = () => {
  const [pdfFile, setPdfFile] = useState(null); // Stores the uploaded PDF
  const [pageNumber, setPageNumber] = useState(1); // Current page number
  const [numPages, setNumPages] = useState(null); // Total number of pages
  const canvasRef = useRef(null);
  const [selection, setSelection] = useState(null);
  const [startPosition, setStartPosition] = useState(null);

  // Define predefined box coordinates for automatic cropping
  const cropBox = {
    x: 100,  // X-coordinate of the box
    y: 100,  // Y-coordinate of the box
    width: 200,  // Width of the box
    height: 150, // Height of the box
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPdfFile(file);
    }
  };

  // On document load success, set the number of pages
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1); // Reset to the first page
  };

  // Mouse events for drawing the snip rectangle (for manual selection)
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setStartPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setSelection(null);
  };

  const handleMouseMove = (e) => {
    if (!startPosition) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const currentPosition = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setSelection({
      x: Math.min(startPosition.x, currentPosition.x),
      y: Math.min(startPosition.y, currentPosition.y),
      width: Math.abs(currentPosition.x - startPosition.x),
      height: Math.abs(currentPosition.y - startPosition.y),
    });
  };

  const handleMouseUp = () => {
    setStartPosition(null);
  };

  // Crop the selected area manually (for manual snip)
  const cropSelection = () => {
    if (!selection || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const croppedCanvas = document.createElement("canvas");
    const croppedContext = croppedCanvas.getContext("2d");

    croppedCanvas.width = selection.width;
    croppedCanvas.height = selection.height;

    croppedContext.drawImage(
      canvas,
      selection.x,
      selection.y,
      selection.width,
      selection.height,
      0,
      0,
      selection.width,
      selection.height
    );

    const croppedImage = croppedCanvas.toDataURL("image/png");
    console.log("Cropped Image:", croppedImage);
    alert("Snip created! Check console for Base64 output.");
  };

  // Auto-crop the PDF using predefined box coordinates
  const autoCrop = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const croppedCanvas = document.createElement("canvas");
    const croppedContext = croppedCanvas.getContext("2d");

    croppedCanvas.width = cropBox.width;
    croppedCanvas.height = cropBox.height;

    croppedContext.drawImage(
      canvas,
      cropBox.x,
      cropBox.y,
      cropBox.width,
      cropBox.height,
      0,
      0,
      cropBox.width,
      cropBox.height
    );

    const croppedImage = croppedCanvas.toDataURL("image/png");
    console.log("Auto-cropped Image:", croppedImage);
    alert("Auto Snip created! Check console for Base64 output.");
  };

  return (
    <div>
      <h1>PDF Snipper with react-pdf</h1>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />

      {pdfFile && (
        <div>
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page
              pageNumber={pageNumber}
              canvasRef={(canvas) => {
                if (canvas) {
                  canvasRef.current = canvas;
                }
              }}
              renderMode="svg"  // Use "svg" to render the TextLayer properly
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            />
          </Document>

          <div>
            <button
              onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
              disabled={pageNumber <= 1}
            >
              Previous
            </button>
            <span>
              Page {pageNumber} of {numPages}
            </span>
            <button
              onClick={() =>
                setPageNumber((prev) => Math.min(prev + 1, numPages))
              }
              disabled={pageNumber >= numPages}
            >
              Next
            </button>
          </div>

          {selection && (
            <div
              style={{
                position: "absolute",
                border: "2px dashed red",
                background: "rgba(255, 0, 0, 0.2)",
                top: `${selection.y}px`,
                left: `${selection.x}px`,
                width: `${selection.width}px`,
                height: `${selection.height}px`,
                pointerEvents: "none",
              }}
            />
          )}

          <button onClick={cropSelection} style={{ marginTop: "10px" }}>
            Crop Snip
          </button>

          <button onClick={autoCrop} style={{ marginTop: "10px", marginLeft: "10px" }}>
            Auto Crop Snip
          </button>
        </div>
      )}
    </div>
  );
};

export default PDFSnipper;
