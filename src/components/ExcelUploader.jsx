import React, { useState, useRef } from 'react';
import { FileSpreadsheet, Plus, X, ArrowRight, Loader2, CheckCircle2, Download } from 'lucide-react';

// PLACEHOLDER: Replace with your actual Google Apps Script URL
const API_URL = 'https://script.google.com/a/macros/rabbitinvest.com/s/AKfycbxGiXNyr8x0qgGKnY-SHupeVm2qL3vVWWFSC-s6HnVzmAf1_yTfpCQn-lNNJFG5eZAO3w/exec';
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
    if (data.downloadUrl) {
      // Direct Drive download link from API response
      window.open(data.downloadUrl, "_blank");
    } else {
      // Fallback for base64 if still returned
      const fileContent = data.fileBase64 || data.file;
      if (!fileContent) return;
      
      const fileName = data.filename || `NSE_${file.name}`;
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

  const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);
    setError(null);

    try {
      // Read file as text for CSV import as per the provided spec
      const csvText = await file.text();
      
      const response = await fetch(API_URL, {
        method: 'POST',
        // Note: Google Apps Script POSTs often work best without 'Content-Type' header 
        // to avoid preflight, but let's stick to the example provided.
        body: JSON.stringify({
          token: API_TOKEN,
          action: "import",
          csv: csvText
        })
      });

      const data = await response.json();

      if (data.ok) {
        setConvertedData(data);
        if (data.downloadUrl) {
           window.open(data.downloadUrl, "_blank");
        }
      } else {
        setError(data.error || "Conversion failed");
        // We show the debug view even on error if needed
        onConversionSuccess(data); 
      }
    } catch (err) {
      console.error("Conversion Error:", err);
      setError("Connection failed. Please check your internet or API deployment.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="upload-container">
      <h1 className="upload-title">Convert CSV/Excel from BSE to NSE.</h1>

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
              <FileSpreadsheet size={48} className="file-icon" strokeWidth={1} style={{ color: '#16a34a' }} />
              <div className="file-name">{file.name}</div>
            </div>
            
            {error && <p style={{ color: 'red', marginTop: '1rem', fontWeight: 'bold' }}>Error: {error}</p>}

            {convertedData ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                <div style={{ 
                  backgroundColor: '#ecfdf5', 
                  color: '#065f46', 
                  padding: '1rem 2rem', 
                  borderRadius: '12px', 
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  animation: 'popIn 0.3s ease-out'
                }}>
                  <CheckCircle2 size={20} />
                  Downloading Completed
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    className="btn-convert" 
                    onClick={() => handleDownloadResults(convertedData)}
                    style={{ backgroundColor: '#16a34a', boxShadow: '0 10px 20px rgba(22, 163, 74, 0.3)', margin: 0 }}
                  >
                    <Download size={20} />
                    Download Again
                  </button>
                  <button 
                    className="btn-convert" 
                    onClick={handleRemove}
                    style={{ backgroundColor: '#1e3a8a', padding: '1rem 2rem', margin: 0 }}
                  >
                    <Plus size={20} />
                    Upload New File
                  </button>
                </div>

                <button 
                   style={{ 
                     background: 'none', 
                     border: 'none', 
                     color: '#64748b', 
                     textDecoration: 'underline', 
                     cursor: 'pointer',
                     fontSize: '0.9rem' 
                   }}
                   onClick={() => onConversionSuccess(convertedData)}
                >
                  View conversion summary
                </button>
              </div>
            ) : (
              <button 
                  className="btn-convert" 
                  onClick={handleConvert}
                  disabled={isConverting}
                  style={{ 
                    opacity: isConverting ? 0.7 : 1, 
                    cursor: isConverting ? 'wait' : 'pointer', 
                    backgroundColor: '#1e3a8a',
                    margin: '2rem 0 0 0'
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
