import { useState, useEffect } from 'react';
import DeliveryForm from './components/DeliveryForm';
import PreviewNote from './components/PreviewNote';
import FinalNote from './components/FinalNote';

function App() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('if_theme') === 'dark');
  const [currentScreen, setCurrentScreen] = useState(0); 
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  // THE GLOBAL STATE KEYS MAPPED EXACTLY TO YOUR INPUTS
  const [formData, setFormData] = useState({
    farmerName: '', date: '', address: '', from: '', to: '', product: '',
    weight: '', rate: '', vehicle: '', driver: '', saleAddress: '',
    specialNote: '', hire: '', extra: ''
  });

  const [historyList, setHistoryList] = useState(() => {
    return JSON.parse(localStorage.getItem('if_history')) || [];
  });

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('if_theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('if_theme', 'light');
    }
  }, [isDark]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // FIXED SAVE LOGIC: Explicitly calculates and bundles data before stringifying
  const handleFinalCompilation = (compiledPhotoUri) => {
    setGeneratedImage(compiledPhotoUri);

    if (formData.farmerName.trim()) {
      // Calculate totals for the history item preview explicitly
      const weightNum = parseFloat(formData.weight) || 0;
      const rateNum = parseFloat(formData.rate) || 0;
      const hireNum = parseFloat(formData.hire) || 0;
      const extraNum = parseFloat(formData.extra) || 0;
      
      const totalCost = weightNum * rateNum;
      const finalBalance = totalCost - hireNum - extraNum;

      const newHistoryRecord = {
        id: Date.now(),
        dateStr: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        calculatedTotal: totalCost,
        calculatedFinal: finalBalance,
        ...formData // Dumps all values safely inside
      };

      const updatedHistory = [newHistoryRecord, ...historyList].slice(0, 50);
      setHistoryList(updatedHistory);
      localStorage.setItem('if_history', JSON.stringify(updatedHistory));
    }

    setCurrentScreen(2); 
  };

  const loadFromHistory = (note) => {
    setFormData({
      farmerName: note.farmerName || '',
      date: note.date || '',
      address: note.address || '',
      from: note.from || '',
      to: note.to || '',
      product: note.product || '',
      weight: note.weight || '',
      rate: note.rate || '',
      vehicle: note.vehicle || '',
      driver: note.driver || '',
      saleAddress: note.saleAddress || '',
      specialNote: note.specialNote || '',
      hire: note.hire || '',
      extra: note.extra || ''
    });
    setIsHistoryOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    alert("✅ Note Loaded Successfully!");
  };

  const deleteFromHistory = (id) => {
    if (window.confirm("Are you sure you want to delete this note permanently?")) {
      const updatedHistory = historyList.filter(item => item.id !== id);
      setHistoryList(updatedHistory);
      localStorage.setItem('if_history', JSON.stringify(updatedHistory));
    }
  };

  const handleResetApp = () => {
    setFormData({
      farmerName: '', date: '', address: '', from: '', to: '', product: '',
      weight: '', rate: '', vehicle: '', driver: '', saleAddress: '',
      specialNote: '', hire: '', extra: ''
    });
    setGeneratedImage(null);
    setCurrentScreen(0);
  };

  return (
    <>
      <header className="header" style={{ position: 'sticky', top: 0, zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>🌿 INSTANTFARMS</h1>
        <button 
          onClick={() => setIsDark(!isDark)} 
          style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', margin: 0, padding: '6px 12px', fontSize: '14px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', boxShadow: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer' }}
        >
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      <div className="container">
        {currentScreen === 0 && (
          <>
            <DeliveryForm 
              formData={formData} 
              handleChange={handleChange} 
              isHistoryOpen={isHistoryOpen}
              onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
              onPreview={() => { window.scrollTo(0, 0); setCurrentScreen(1); }} 
            />

            {/* FIXED HISTORY VIEWER UI PANEL */}
            {isHistoryOpen && (
              <div id="historyContainer" style={{ marginTop: '20px', borderTop: '2px solid var(--border-color)', paddingTop: '20px' }}>
                <h2 style={{ marginTop: 0 }}>📜 గత చరిత్ర / Past Notes</h2>
                <div id="historyList" style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '5px' }}>
                  {historyList.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '20px' }}>No saved notes yet!</p>
                  ) : (
                    historyList.map((note) => {
                      return (
                        <div key={note.id} style={{ border: '1px solid var(--border-color)', padding: '15px', marginBottom: '12px', borderRadius: '8px', background: 'var(--input-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                          <div>
                            <strong style={{ color: 'var(--primary-color)', fontSize: '16px' }}>{note.farmerName}</strong><br />
                            <small style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                              {note.dateStr} • {note.product || 'No product'} • {note.calculatedFinal ? note.calculatedFinal + '/-' : '0/-'}
                            </small>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => loadFromHistory(note)} style={{ margin: 0, padding: '8px 16px', fontSize: '14px', width: 'auto', boxShadow: 'none' }}>Load</button>
                            <button onClick={() => deleteFromHistory(note.id)} style={{ margin: 0, padding: '8px 12px', fontSize: '14px', width: 'auto', backgroundColor: '#EF4444', boxShadow: 'none' }}>🗑️</button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {currentScreen === 1 && (
          <PreviewNote 
            formData={formData} 
            onEdit={() => setCurrentScreen(0)} 
            onGenerate={handleFinalCompilation}
          />
        )}

        {currentScreen === 2 && (
          <FinalNote 
            generatedImage={generatedImage}
            onEdit={() => setCurrentScreen(0)}
            onReset={handleResetApp}
          />
        )}
      </div>
    </>
  );
}

export default App;