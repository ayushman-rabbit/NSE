import React from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Download, FileText, ExternalLink } from 'lucide-react';

export default function ResultPage({ data, onBack }) {
  const isSuccess = data?.ok || data?.status === 'success';
  const fileContent = data?.fileBase64 || data?.file;

  const handleDownload = () => {
    if (!fileContent) return;
    const fileName = data.filename || 'NSE_Converted_File.xlsx';
    const isCsv = fileName.toLowerCase().endsWith('.csv');
    const mimeType = isCsv ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    const link = document.createElement('a');
    link.href = `data:${mimeType};base64,${fileContent}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="result-container" style={{ width: '100%', maxWidth: '800px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <button 
        onClick={onBack}
        className="btn-back"
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.6rem', 
          background: 'none', 
          color: '#1e3a8a', 
          fontWeight: '700',
          marginBottom: '2.5rem',
          padding: '0.5rem 0',
          fontSize: '1rem',
          transition: 'transform 0.2s',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <ArrowLeft size={22} />
        Back to Converter
      </button>

      <div style={{ 
        background: 'white', 
        padding: '3rem', 
        borderRadius: '24px', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
        border: '1px solid #f1f5f9',
        animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: isSuccess ? '#ecfdf5' : '#fef2f2',
            marginBottom: '1.5rem'
          }}>
            {isSuccess ? (
              <CheckCircle2 size={40} color="#10b981" />
            ) : (
              <AlertCircle size={40} color="#ef4444" />
            )}
          </div>
          <h1 style={{ 
            fontSize: '2.25rem', 
            fontWeight: '800', 
            color: '#0f172a', 
            margin: '0 0 0.5rem 0',
            letterSpacing: '-0.025em'
          }}>
            {isSuccess ? 'Conversion Ready!' : 'Conversion Error'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.125rem', margin: 0 }}>
            {isSuccess 
              ? 'Your file has been successfully processed from BSE to NSE.' 
              : 'There was a problem processing your request.'}
          </p>
        </div>

        {isSuccess && fileContent && (
          <div style={{ 
            background: '#f8fafc', 
            borderRadius: '20px', 
            padding: '2.5rem', 
            border: '1px solid #e2e8f0',
            marginBottom: '2.5rem',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <FileText size={64} color="#1e3a8a" strokeWidth={1.5} style={{ opacity: 0.8 }} />
            </div>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b', fontWeight: '700' }}>
              {data.filename || 'Transformed_File.xlsx'}
            </h3>
            <button 
              onClick={handleDownload}
              className="btn-download-result"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: '#1e3a8a',
                color: 'white',
                padding: '1rem 2.5rem',
                borderRadius: '12px',
                fontSize: '1.125rem',
                fontWeight: '600',
                boxShadow: '0 10px 15px -3px rgba(30, 58, 138, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              <Download size={22} />
              Download Converted File
            </button>
          </div>
        )}

        <div style={{ marginTop: isSuccess ? '0' : '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontWeight: '700', color: '#475569', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Full API Response Debug
            </span>
          </div>
          <div style={{ 
            background: '#0f172a', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            maxHeight: '300px',
            overflowY: 'auto',
            boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
          }}>
            <pre style={{ 
              margin: 0, 
              whiteSpace: 'pre-wrap', 
              wordBreak: 'break-all',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              color: '#94a3b8',
              fontSize: '0.875rem',
              lineHeight: '1.6'
            }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .btn-download-result:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 20px -3px rgba(30, 58, 138, 0.4);
          background-color: #1e40af;
        }
        .btn-download-result:active {
          transform: translateY(0);
        }
        .btn-back:hover {
           transform: translateX(-4px);
        }
      `}</style>
    </div>
  );
}
