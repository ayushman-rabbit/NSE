import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import ExcelUploader from './components/ExcelUploader'
import ResultPage from './components/ResultPage'

function App() {
  const [view, setView] = useState('upload'); // 'upload' or 'result'
  const [apiData, setApiData] = useState(null);

  const handleConversionSuccess = (data) => {
    setApiData(data);
    setView('result');
  };

  const handleBackToUpload = () => {
    setApiData(null);
    setView('upload');
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {view === 'upload' ? (
          <ExcelUploader onConversionSuccess={handleConversionSuccess} />
        ) : (
          <ResultPage data={apiData} onBack={handleBackToUpload} />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
