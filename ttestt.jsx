const convertPdfToImage = async (fileURL) => {
    const loadingTask = pdfjs.getDocument(fileURL);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1); // Convert only the first page

    const scale = 2; // Higher scale means better quality
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
        canvasContext: context,
        viewport: viewport,
    };

    await page.render(renderContext).promise;

    const imageDataUrl = canvas.toDataURL("image/png"); // Convert canvas to image

    setUploadedFiles(prev => ({
        ...prev,
        [current]: { name: "Converted PDF", url: imageDataUrl, type: "image/png" }
    }));

    message.success("PDF converted to image successfully!");
};
