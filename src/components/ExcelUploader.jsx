import React, { useState, useRef } from 'react';
import { FileSpreadsheet, Plus, X, ArrowRight, Loader2, CheckCircle2, Download } from 'lucide-react';

// PLACEHOLDER: Replace with your actual Google Apps Script URL
const API_URL = 'https://script.google.com/macros/s/AKfycbxVOfzf7M-hyz54r_9xnuoEfcGqj9jUJ_2wTx7-GAnz556No1fCjM-WGCcP9ZJ7BAosVQ/exec';
const API_TOKEN = '1234';

export default function ExcelUploader({ onConversionSuccess }) {
  const [file, setFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);
  const [convertedData, setConvertedData] = useState(null); // Store data to show download button here
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setConvertedData(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
      setConvertedData(null);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setConvertedData(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError(null);
  };

  const handleDownloadResults = (data) => {
    if (!data) return;
    
    if (data.downloadUrl) {
      // Use location.assign to trigger the download in the current window.
      // Since it's a file download, the browser will stay on the current page.
      window.location.assign(data.downloadUrl);
    } else {
      // Fallback for base64
      const fileContent = data.fileBase64 || data.file;
      if (!fileContent) return;
      
      const fileName = data.filename || `NSE_${file ? file.name : 'Converted_File'}`;
      const isCsv = fileName.toLowerCase().endsWith('.csv');
      const mimeType = isCsv ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      
      const link = document.createElement('a');
      link.href = `data:${mimeType};base64,${fileContent}`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleConvert = async (e) => {
    if (e) e.preventDefault();
    if (!file) return;

    setIsConverting(true);
    setError(null);
    setConvertedData(null);

    try {
      const csvText = await file.text();
      
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({
          token: API_TOKEN,
          action: "import",
          csv: csvText
        })
      });

      const data = await response.json();

      if (data.ok) {
        setConvertedData(data);
        handleDownloadResults(data);
      } else {
        setError(data.error || "Conversion failed. Please check your file or token.");
        // Keep everything on this page as requested
      }
    } catch (err) {
      console.error("Conversion Error:", err);
      setError("Connection failed. Service might be unavailable.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="upload-container">
      <h1 className="upload-title">Client Master : BSE to NSE</h1>

      {!file ? (
        <div 
          className="upload-box"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange} 
            accept=".xlsx, .xls, .csv"
            style={{ display: 'none' }}
          />
          <button 
            className="btn-select-file"
            onClick={() => fileInputRef.current.click()}
          >
            Select CSV or Excel file
          </button>
          <p className="drop-text">or drop file here</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100vw', maxWidth: '100%' }}>
            <div className="file-card">
              <div 
                className="action-badge" 
                onClick={handleRemove}
                title="Remove file"
              >
                <X size={16} /> 
              </div>
              <FileSpreadsheet size={48} className="file-icon" strokeWidth={1} style={{ color: '#1e3a8a' }} />
              <div className="file-name">{file.name}</div>
            </div>
            
            {error && <p style={{ color: 'red', marginTop: '1rem', fontWeight: 'bold' }}>Error: {error}</p>}

            {convertedData ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                <div style={{ 
                  backgroundColor: '#f1f5f9', 
                  color: '#1e3a8a', 
                  padding: '1rem 2rem', 
                  borderRadius: '12px', 
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  border: '1px solid #e2e8f0',
                  animation: 'popIn 0.3s ease-out'
                }}>
                  <CheckCircle2 size={22} />
                  DOWNLOADING COMPLETED
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    type="button"
                    className="btn-convert" 
                    onClick={() => handleDownloadResults(convertedData)}
                    style={{ backgroundColor: '#1e3a8a', boxShadow: 'none', margin: 0 }}
                  >
                    <Download size={20} />
                    Download Again
                  </button>
                  <button 
                    type="button"
                    className="btn-convert" 
                    onClick={handleRemove}
                    style={{ backgroundColor: '#1e3a8a', padding: '1rem 2rem', margin: 0, boxShadow: 'none' }}
                  >
                    <Plus size={20} />
                    Upload New File
                  </button>
                </div>
              </div>
            ) : (
              <button 
                  type="button"
                  className="btn-convert" 
                  onClick={handleConvert}
                  disabled={isConverting}
                  style={{ 
                    opacity: isConverting ? 0.7 : 1, 
                    cursor: isConverting ? 'wait' : 'pointer', 
                    backgroundColor: '#1e3a8a',
                    margin: '2rem 0 0 0',
                    boxShadow: 'none'
                  }}
              >
                  {isConverting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Converting...
                    </>
                  ) : (
                    <>
                      Convert
                      <ArrowRight size={20} />
                    </>
                  )}
              </button>
            )}
        </div>
      )}
    </div>
  );
}
